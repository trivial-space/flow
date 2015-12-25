const uuid = require('uuid')


// ===== entity system types =====

function createEntity ({
  id = uuid.v4(),
  value
}) {
  return {
    id,
    value
  }
}


function createProcess ({
  id = uuid.v4(),
  procedure
}) {
  return {
    id,
    procedure,
    out: ""
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


// ===== module interface =====

module.exports = {
  createEntity,
  createProcess,
  createChannel
}
