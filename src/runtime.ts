import * as types from './runtime-types'


export function create() {

  var entities = {},
      processes = {},
      arcs = {},
      meta = {},
      context = null,
      engine = {
        es: {},
        ps: {},
      },
      debug = false


  function getGraph() {
    return { entities, processes, arcs, meta }
  }


  function getState() {
    let state = {}
    for (let eId in engine.es) {
      state[eId] = engine.es[eId].val
    }
    return state
  }


  function getContext() {
    return context
  }


  function setContext(ctx) {
    context = ctx;
  }


  function getMeta() {
    return meta;
  }


  function setMeta(newMeta) {
    if (newMeta != null && typeof newMeta === "object" && !(newMeta instanceof Array)) {
      meta = Object.assign({}, meta, newMeta)
    }
  }


  function setDebug(isDebug) {
    debug = isDebug
  }


  // ===== entity operations =====

  function get (id: string): any {
    return engine.es[id] && engine.es[id].val
  }


  function set (id: string, value: any) {
    let eE = engineE(id)
    eE.val = value
    touchEntity(eE)
    flush()
  }


  function update (id: string, fn: (val: any) => any) {
    set(id, fn(get(id)))
  }


  function on (id: string, cb: (val: any) => void) {
    let eE = engineE(id)
    eE.cb = cb
  }


  function off (id: string) {
    let eE = engineE(id)
    delete eE.cb
  }


  // ===== update flow topology =====

  function addEntity(spec: types.EntityData): types.Entity {
    let e = types.createEntity(spec)
    entities[e.id] = e

    let eE = engineE(e.id)
    eE.event = e.isEvent

    if (e.value != null && eE.val == null) {
      eE.val = e.value
      touchEntity(eE)
    }

    if (e.json != null && eE.val == null) {
      eE.val = JSON.parse(e.json)
      touchEntity(eE)
    }
    return e
  }


  function removeEntity(id: string) {
    let eE = engineE(id)
    for (let aId in eE.arcs) {
      removeArc(aId)
    }
    delete engine.es[id]
    delete entities[id]
  }


  function addProcess(spec: types.ProcessData): types.Process {
    let p = types.createProcess(spec, context)
    processes[p.id] = p
    let eP = engineP(p.id)

    eP.acc = null
    eP.async = p.async

    // cleanup unused arcs
    const portNames = Object.keys(p.ports)
    for(let aId in eP.arcs) {
      let port = arcs[aId].port
      if (port &&
        (portNames.indexOf(port) < 0 ||
          p.ports[port] === types.PORT_TYPES.ACCUMULATOR)) {
        removeArc(aId)
      }
    }

    // set accumulator if present
    for (let portId in p.ports) {
      if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
        eP.acc = portId
      }
    }

    // readjust already present arc
    for(let aId in eP.arcs) {
      updateArc(arcs[aId])
    }

    return p
  }


  function removeProcess(id: string) {
    let eP = engineP(id)
    eP.stop && eP.stop()
    for (let aId in eP.arcs) {
      removeArc(aId)
    }
    delete engine.ps[id]
    delete processes[id]
  }


  function addArc(spec: types.ArcData): types.Arc {
    let arc = types.createArc(spec)
    arcs[arc.id] = arc
    updateArc(arc)

    // autostart
    let eP = engineP(arc.process),
        p = processes[arc.process]
    if (p && p.autostart === true &&
        Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
      autostart(eP)
    }

    return arc
  }


  function removeArc(id: string) {
    let arc = arcs[id]

    if (arc) {
      var eP = engineP(arc.process),
          eE = engineE(arc.entity)

      delete eP.arcs[id]
      delete eE.arcs[id]

      if (arc.port) {
        delete eE.effects[arc.process]
        delete eP.sources[arc.port]
        delete eP.values[arc.port]
      } else {
        eP.sink = function() {}
        delete eP.out
        delete eE.reactions[arc.process]
      }
    }
    delete arcs[id]
  }


  function updateArc(arc: types.Arc) {
    let pId = arc.process,
        eId = arc.entity,
        eP = engineP(pId),
        eE = engineE(eId),
        p = processes[pId]

    eE.arcs[arc.id] = true

    if (p) {

      eP.arcs[arc.id] = true

      // from entity to process
      if (arc.port) {
        eP.sources[arc.port] = eE
        if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
          eE.effects[pId] = eP
        } else {
          delete eE.effects[pId]
        }

      // from process to entity
      } else {
        eP.sink = value => {
          eE.val = value
          touchEntity(eE)
          if (!blockFlush) {
            flush()
          } else {
            continueFlush = true
          }
        }
        eP.out = eE
        if (eP.acc) {
          eP.sources[eP.acc] = eE
          eE.reactions[pId] = eP
        } else {
          delete eE.reactions[pId]
        }
      }
    }
  }


  function addGraph(graphSpec: types.Graph) {
    if (graphSpec.entities) {
      for (let i in graphSpec.entities) {
        addEntity(graphSpec.entities[i])
      }
    }
    if (graphSpec.processes) {
      for (let i in graphSpec.processes) {
        addProcess(graphSpec.processes[i])
      }
    }
    if (graphSpec.arcs) {
      for (let i in graphSpec.arcs) {
        addArc(graphSpec.arcs[i])
      }
    }
    if (graphSpec.meta) {
      setMeta(graphSpec.meta)
    }
    flush()
  }


  // ===== flow execution =====

  var touchedEntities = {}


  function touchEntity(eE, eP?) {
    touchedEntities[eE.id] = eP || true
  }

  let order: any[][] = [],
      callbacks = {},
      syncSchedule = {},
      asyncSchedule = {},
      activeEntities = {},
      blockFlush = false,
      continueFlush = false


  function getSchedule(eE, level = 0, pLast) {

    activeEntities[eE.id] = true

    if (eE.cb) {
      callbacks[eE.id] = eE
    }

    if (!pLast || !pLast.acc) {
      let inc = false
      for (let pId in eE.reactions) {
        inc = true
        if (!syncSchedule[pId]) {
          syncSchedule[pId] = { level, eP: eE.reactions[pId] }
        } else if (syncSchedule[pId].level < level) {
          syncSchedule[pId].level = level
        }
      }

      if (inc) level++
    }

    for (let pId in eE.effects) {
      let eP = eE.effects[pId]

      if (eP.async) {
        asyncSchedule[pId] = eP
      } else {

        if (eP.acc && eP.out && eP.out.val == null) {
          continue
        }

        if (!syncSchedule[pId]) {
          syncSchedule[pId] = { level, eP }
        } else if (syncSchedule[pId].level < level) {
          syncSchedule[pId].level = level
        }

        if (eP.out) {
          getSchedule(eP.out, level + 1, eP)
        }
      }
    }
  }


  function flush() {
    if(debug) {
      console.log("flushing graph with", touchedEntities)
    }

    activeEntities = {}
    syncSchedule = {}
    asyncSchedule = {}
    callbacks = {}

    // schedule
    for (let eId in touchedEntities) {
      getSchedule(engine.es[eId], 0, touchedEntities[eId])
    }

    touchedEntities = {}

    // sync calls
    for (let eId in syncSchedule) {
      let step = syncSchedule[eId]
      if (order[step.level]) {
        order[step.level].push(step.eP)
      } else {
        order[step.level] = [step.eP]
      }
    }

    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order[i].length; j++) {
        execute(order[i][j], activeEntities)
      }
    }

    order.length = 0

    // callbacks
    for (let eId in callbacks) {
      callbacks[eId].cb(callbacks[eId].val)
    }

    // async calls
    blockFlush = true
    continueFlush = false
    for (let pId in asyncSchedule) {
      execute(asyncSchedule[pId], activeEntities)
    }
    blockFlush = false

    continueFlush && flush()
  }


  function execute(eP, activeEntities?) {
    if(debug) {
      console.log("executing process", eP.id)
    }
    for (let portId in eP.sources) {
      let src = eP.sources[portId]
      if (src.event && !(activeEntities && activeEntities[src.id])) {
        eP.values[portId] = undefined
      } else {
        eP.values[portId] = src.val
      }
    }
    if (eP.async) {
      eP.stop && eP.stop()
      eP.stop = processes[eP.id].procedure.call(context, eP.values, eP.sink)
    } else {
      let val = processes[eP.id].procedure.call(context, eP.values)
      if (eP.out) eP.out.val = val
    }
  }


  function autostart(eP) {
    if (eP.async) {
      setTimeout(function() {
        execute(eP)
      }, 10)
    } else {
      execute(eP)
      touchEntity(eP.out)
    }
  }


  function start(processId) {
    let eP = engineP(processId)
    execute(eP)
    if (eP.out && !eP.async) {
      touchEntity(eP.out, eP)
      flush()
    }
  }


  function stop(processId) {
    let eP = engineP(processId)
    eP.stop && eP.stop()
    delete eP.stop
  }


  // ===== helpers =====

  function engineE(id) {
    if (!entities[id]) {
      addEntity({id})
    }
    return engine.es[id] || (engine.es[id] = {
      id,
      reactions: {},
      effects: {},
      arcs: {}
    })
  }


  function engineP(id) {
    return engine.ps[id] || (engine.ps[id] = {
      id,
      acc: null,
      sources: {},
      arcs: {},
      values: {},
      sink: () => {}
    })
  }


  // ===== runtime api =====

  return {

    addEntity,
    removeEntity,
    addProcess,
    removeProcess,
    addArc,
    removeArc,
    addGraph,

    getGraph,
    getState,
    setMeta,
    getMeta,
    getContext,
    setContext,
    setDebug,

    get: get,
    set: set,
    update,
    on,
    off,

    start,
    stop,

    PORT_TYPES: Object.assign({}, types.PORT_TYPES)
  }
}
