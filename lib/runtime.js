import types from './runtime-types'


function create() {

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
      meta = {
        ...meta,
        ...newMeta
      }
    }
  }


  function setDebug(isDebug) {
    debug = isDebug
  }


  // ===== entity operations =====

  function get (id) {
    return engine.es[id] && engine.es[id].val
  }


  function set (id, value) {
    let eE = engineE(id)
    eE.val = value
    touchEntity(eE)
    flush()
  }


  function update (id, fn) {
    set(id, fn(get(id)))
  }


  function on (id, cb) {
    let eE = engineE(id)
    eE.cb = cb
  }


  function off (id) {
    let eE = engineE(id)
    delete eE.cb
  }


  // ===== update flow topology =====

  function addEntity(spec) {
    let e = types.createEntity(spec)
    entities[e.id] = e
    let eE = engineE(e.id)
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


  function removeEntity(id) {
    let eE = engineE(id)
    for (let aId in eE.arcs) {
      removeArc(aId)
    }
    delete engine.es[id]
    delete entities[id]
  }


  function addProcess(spec) {
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


  function removeProcess(id) {
    let eP = engineP(id)
    eP.stop && eP.stop()
    for (let aId in eP.arcs) {
      removeArc(aId)
    }
    delete engine.ps[id]
    delete processes[id]
  }


  function addArc(spec) {
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


  function removeArc(id) {
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


  function updateArc(arc) {
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
          flush()
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


  function addGraph(graphSpec) {
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

  var touchedEntities = {},
      executedProcesses = {}


  function touchEntity(eE) {
    touchedEntities[eE.id] = eE
  }


  function getTouches(touches, eE, level = 0, eP) {
    if (!touches[eE.id]) {
      touches[eE.id] = {level}
    }

    let touch = touches[eE.id]

    if (!eP || !eP.acc) {
      touch.reload = true
    }

    if (touch.level < level) {
      touch.level = level
    }

    if (!touch.reload && eP.acc) {
      if (touch.acc) {
        touch.acc[eP.id] = true
      } else {
        touch.acc = {[eP.id]: eP}
      }
    }

    for (let pId in eE.effects) {
      let pNext = eE.effects[pId]
      if (pNext.acc) {
        touch.level += 1
      }
      if (pNext.out && !pNext.async) {
        getTouches(touches, pNext.out, level + 1, pNext)
      }
    }
  }


  function flush() {
    let order = [],
        later = [],
        touches = {},
        p

    for (let eId in touchedEntities) {
      getTouches(touches, touchedEntities[eId])
    }

    for (let eId in touches) {
      let touch = touches[eId]
      touch.eE = engine.es[eId]
      if (order[touch.level]) {
        order[touch.level].push(touch)
      } else {
        order[touch.level] = [touch]
      }
    }

    for (let i in order) {
      for (let j in order[i]) {
        let touch = order[i][j],
        eE = touch.eE
        if (touch.reload) {
          for (let pId in eE.reactions) {
            p = engine.ps[pId]
            if (p.async) {
              later.push(p)
            } else if (!executedProcesses[p.id]) {
              execute(p)
              executedProcesses[p.id] = true
            }
          }
        } else if (touch.acc) {
          for (let pId in touch.acc) {
            p = engine.ps[pId]
            if (p.async) {
              later.push(p)
            } else if (!executedProcesses[p.id]) {
              execute(p)
              executedProcesses[p.id] = true
            }
          }
        }
        for (let pId in eE.effects) {
          p = engine.ps[pId]
          if (p.async) {
            later.push(p)
          } else if (!executedProcesses[p.id]) {
            execute(p)
            executedProcesses[p.id] = true
          }
        }
        if (eE.cb) {
          eE.cb(eE.val)
        }
      }
    }

    touchedEntities = {}
    executedProcesses = {}

    for (let i in later) {
      execute(later[i])
    }
  }


  function execute(eP) {
    if(debug) {
      console.log("executing process", eP.id)
    }
    for (let portId in eP.sources) {
      eP.values[portId] = eP.sources[portId].val
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
      executedProcesses[processId] = true
      touchEntity(eP.out)
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

    PORT_TYPES: {...types.PORT_TYPES}
  }
}


export default {
  create
}
