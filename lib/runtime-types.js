import {v4} from './utils/uuid'
import {evaluate} from './utils/code-evaluator'


// ===== entity system types =====

function createEntity ({
  id = v4(),
  value,
  json,
  meta
}) {
  return {
    id,
    value,
    json,
    meta: {...meta}
  }
}


function createProcess ({
  id = v4(),
  ports = {},
  procedure,
  code,
  autostart,
  async,
  meta
}, context) {

  // calculated values
  if (code == null) code = procedure.toString()
  if (procedure == null) {
    procedure = evaluate(code, context)
  }

  return {
    id,
    ports,
    procedure,
    code,
    autostart,
    async: async,
    meta: {...meta},
  }
}


function createArc ({
  id,
  entity,
  process,
  port,
  meta,
}) {

  if (entity == null) {
    throw TypeError("no entity specified in arc " + id)
  }
  if (process == null) {
    throw TypeError("no process specified in arc " + id)
  }
  if (id == null) {
    if (port == null) {
      id = process + '->' + entity
    } else {
      id = entity + '->' + process + '::' + port
    }
  }

  return {
    id,
    entity,
    process,
    port,
    meta: {...meta}
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
  createArc,
  PORT_TYPES
}
