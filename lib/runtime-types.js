const uuid = require('uuid')


// ===== entity system types =====

function createEntity ({
  id = uuid.v4(),
  value
}) {
  return {
    id,
    value,
    processes: {}
  }
}


function createProcess ({
  id = uuid.v4(),
  procedure,
  ports = {}
}) {
  return {
    id,
    procedure,
    ports,
    out: function() {},
    entities: {}
  }
}


function createChannel ({
  id = uuid.v4(),
  src,
  dest,
  port
}) {
  return {
    id,
    src,
    dest,
    port
  }
}


// ===== Porttypes =====

const PORT_TYPES = {
  COLD: 'cold',
  HOT: 'hot',
  ACCUMULATOR: 'accumulator'
}


// ===== module interface =====

export default {
  createEntity,
  createProcess,
  createChannel,
  PORT_TYPES
}
