import types from 'runtime-types'


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


  // ===== update flow topology

  function addEntity(spec) {
    let e = types.createEntity(spec)
    entities[e.id] = e
    return e
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


  function addArc(spec) {
    let arc = types.createArc(spec)
    arcs[arc.id] = arc
    updateArc(arc)
    return arc
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
    addProcess,
    addArc,
    start
  }
}


export default {
  create
}
