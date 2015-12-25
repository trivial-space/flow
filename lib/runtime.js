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
  }


  function addChannel(channel) {
    channel = types.createChannel(channel)
    channels[channel.id] = channel
    let p = processes[channel.src]
    let e = entities[channel.dest]
    if (p && e) p.out = value => set(e.id, value)
  }


  // ===== flow execution =====

  function start(processId) {
    let p = processes[processId]
    p.procedure(null, p.out)
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
