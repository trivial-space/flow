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
      }


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


  // ===== entity operations =====

  function get (id) {
    return engine.es[id] && engine.es[id].val
  }


  function set (id, value) {
    let eE = engineE(id)
    propagateValue(eE, value)
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
      propagateValue(eE, e.value)
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
        eP.sources[arc.port] = eId
        if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
          eE.effects[pId] = true
        } else {
          delete eE.effects[pId]
        }

      // from process to entity
      } else {
        eP.sink = value => propagateValue(eE, value, eP)
        eP.out = eId
        if (eP.acc) {
          eP.sources[eP.acc] = eId
          eE.reactions[pId] = true
        } else {
          delete eE.reactions[pId]
        }
      }

      // autostart
      if (p.autostart === true &&
          Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
        autostart(eP)
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
  }


  // ===== flow execution =====

  var touchedEntities = null,
      executedProcesses = {}


  function flush() {
    for (let eId in touchedEntities) {
      let eE = engine.es[eId]
      if (eE.cb) {
        eE.cb(eE.val)
      }
    }
    executedProcesses = {}
    touchedEntities = null
  }

  function propagateValue(eE, value, eP) {
    var async = false
    if (touchedEntities == null) {
      async = true
      touchedEntities = {}
    }

    eE.val = value

    if (!touchedEntities[eE.id]) {
      touchedEntities[eE.id] = true

      if (eP && eP.acc) {
        for (let pId in eE.effects) {
          if (!executedProcesses[pId])
            execute(engine.ps[pId])
        }
      } else {
        for (let pId in eE.reactions) {
          if (!executedProcesses[pId])
            execute(engine.ps[pId])
        }
        for (let pId in eE.effects) {
          if (!executedProcesses[pId])
            execute(engine.ps[pId])
        }
      }
    }

    if (async) {
      flush()
    }
  }


  function execute(eP) {
    executedProcesses[eP.id] = true
    for (let portId in eP.sources) {
      eP.values[portId] = engine.es[eP.sources[portId]].val
    }
    eP.stop && eP.stop()
    eP.stop = processes[eP.id].procedure.call(context, eP.values, eP.sink)
  }


  var scheduledUpdates = {},
      timeout = null

  function autostart(eP) {
    touchedEntities = {[eP.out]: true}
    execute(eP);
    touchedEntities = null

    scheduledUpdates[eP.out] = true

    if (timeout != null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function() {
      touchedEntities = {}
      let es = Object.keys(scheduledUpdates)
      for(let i in es) {
        let eE = engineE(es[i])
        propagateValue(eE, eE.val)
      }
      flush()
      timeout = null
    }, 10)
  }


  function start(processId) {
    execute(engineP(processId))
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
