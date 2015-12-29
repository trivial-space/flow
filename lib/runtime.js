import types from 'runtime-types'


function create() {

  var entities = {},
      processes = {},
      channels = {}


  function get (id) {
    return entities[id] && entities[id].value
  }


  function set (id, value) {
    let entity = entities[id]
    if (entity) {
      entity.value = value
      for (let processId in entity.processes) {
        start(processId)
      }
    } else {
      addEntity({id, value})
    }
  }


  function update (id, fn) {
    set(id, fn(get(id)))
  }


  // ===== update flow topology

  function addEntity(entity) {
    entity = types.createEntity(entity)
    entities[entity.id] = entity
  }


  function addProcess(process) {
    process = types.createProcess(process)
    processes[process.id] = process
    for (let portId in process.ports) {
      if (process.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
        process.accumulator = portId
      }
    }
  }


  function addChannel(channel) {
    channel = types.createChannel(channel)
    channels[channel.id] = channel
    if (channel.port) {
      let p = processes[channel.dest]
      if (p) {
        p.entities[channel.port] = channel.src
        if (p.ports[channel.port] == types.PORT_TYPES.HOT) {
          let e = entities[channel.src]
          if (e) {
            e.processes[channel.dest] = true
          }
        }
      }
    } else {
      let p = processes[channel.src]
      if (p) {
        p.out = value => set(channel.dest, value)
        if (p.accumulator) {
          p.entities[p.accumulator] = channel.dest
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
    update,
    addEntity,
    addProcess,
    addChannel,
    start
  }
}


export default {
  create
}
