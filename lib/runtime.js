import types from './runtime-types'


function create() {

  var entities = {},
      processes = {},
      arcs = {}


  function getState() {
    return { entities, processes, arcs }
  }


  // ===== entity operations =====

  function getOrCreateEntity(id) {
    return entities[id] || addEntity({id})
  }


  function get (id) {
    return entities[id] && entities[id].value
  }


  function set (id, value) {
    let entity = getOrCreateEntity(id)
    entity.value = value
    for (let processId in entity.processes) {
      start(processId)
    }
  }


  function update (id, fn) {
    set(id, fn(get(id)))
  }


  // ===== update flow topology =====

  function addEntity(spec) {
    let e = types.createEntity(spec)
    entities[e.id] = e
    return e
  }


  function removeEntity(id) {
    for (let arcId in arcs) {
      if (arcs[arcId].entity === id) {
        removeArc(arcId)
      }
    }
    delete entities[id]
  }


  function addProcess(spec) {
    let p = types.createProcess(spec)
    processes[p.id] = p
    for (let portId in p.ports) {
      if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
        p.accumulator = portId
      }
    }
    return p
  }


  function removeProcess(id) {
    for (let arcId in arcs) {
      if (arcs[arcId].process === id) {
        removeArc(arcId)
      }
    }
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
      let p = processes[arc.process],
          e = entities[arc.entity]

      if (p) {
        if (arc.port) {
          delete e.processes[p.id]
          delete p.entities[arc.port]
        } else {
          p.out = function() {}
        }
      }
    }
    delete arcs[id]
  }


  function updateArc(arc) {
    let p = processes[arc.process],
        e = getOrCreateEntity(arc.entity)

    if (p) {
      if (arc.port) {
        p.entities[arc.port] = e.id
        if (e) {
          if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
            e.processes[p.id] = true
          } else {
            delete e.processes[p.id]
          }
        }

      } else {
        p.out = value => set(e.id, value)
        if (p.accumulator) {
          p.entities[p.accumulator] = e.id
        }
      }
    }
  }


  // ===== flow execution =====

  function start(processId) {
    let p = processes[processId]
    let ports = {}
    for (let portId in p.entities) {
      ports[portId] = entities[p.entities[portId]].value
    }
    p.procedure(ports, p.out)
  }


  // ===== runtime api =====

  return {
    get: get,
    set: set,
    getState,
    update,
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
