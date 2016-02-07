import types from './runtime-types'


function create() {

  var entities = {},
      processes = {},
      arcs = {},
      graph = {
        e: {},
        p: {},
      }


  function getState() {
    return { entities, processes, arcs }
  }


  // ===== entity operations =====

  function get (id) {
    return graph.e[id] && graph.e[id].val
  }


  function set (id, value) {
    let e = graphE(id)
    e.val = value
    for (let pId in e.ps) {
      start(pId)
    }
  }


  function update (id, fn) {
    set(id, fn(get(id)))
  }


  // ===== update flow topology =====

  function addEntity(spec) {
    let e = types.createEntity(spec)
    entities[e.id] = e
    if (e.value) {
      set(e.id, e.value)
    }
    return e
  }


  function removeEntity(id) {
    let gE = graphE(id)
    for (let aId in gE.as) {
      removeArc(aId)
    }
    delete graph.e[id]
    delete entities[id]
  }


  function addProcess(spec) {
    let p = types.createProcess(spec)
    processes[p.id] = p
    let gP = graphP(p.id)
    for (let portId in p.ports) {
      if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
        gP.acc = portId
      }
    }
    return p
  }


  function removeProcess(id) {
    let gP = graphP(id)
    for (let aId in gP.as) {
      removeArc(aId)
    }
    delete graph.p[id]
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
      var gP = graphP(arc.process),
          gE = graphE(arc.entity)

      if (arc.port) {
        delete gE.ps[arc.process]
        delete gP.es[arc.port]
      } else {
        gP.out = function() {}
      }
    }
    delete arcs[id]
  }


  function updateArc(arc) {
    let pId = arc.process,
        eId = arc.entity,
        gP = graphP(pId),
        gE = graphE(eId),
        p = processes[pId]

    gE.as[arc.id] = true

    if (p) {

      gP.as[arc.id] = true

      // from entity to process
      if (arc.port) {
        gP.es[arc.port] = eId
        if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
          gE.ps[pId] = true
        } else {
          delete gE.ps[pId]
        }

      // from process to entity
      } else {
        gP.out = value => set(eId, value)
        if (gP.acc) {
          gP.es[gP.acc] = eId
        }
      }
    }
  }


  // ===== flow execution =====

  function start(processId) {
    let gP = graphP(processId)
    let ports = {}
    for (let portId in gP.es) {
      ports[portId] = graph.e[gP.es[portId]].val
    }
    processes[processId].procedure(ports, gP.out)
  }


  // ===== helpers =====

  function graphE(id) {
    if (!entities[id]) {
      addEntity({id})
    }
    return graph.e[id] || (graph.e[id] = {
      ps: {},
      as: {}
    })
  }

  function graphP(id) {
    return graph.p[id] || (graph.p[id] = {
      acc: null,
      es: {},
      as: {}
    })
  }


  // ===== runtime api =====


  return {
    get: get,
    set: set,
    update,
    getState,
    addEntity,
    removeEntity,
    addProcess,
    removeProcess,
    addArc,
    removeArc,
    start
  }
}


export default {
  create
}
