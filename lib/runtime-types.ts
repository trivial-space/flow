import {v4} from './utils/uuid'
import {evaluate} from './utils/code-evaluator'


// ===== entity system types =====

export function createEntity ({
  id = v4(),
  value,
  json,
  isEvent,
  meta
}) {
  return {
    id,
    value,
    json,
    isEvent,
    meta: Object.assign({}, meta)
  }
}


export function createProcess ({
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
    meta: Object.assign({}, meta)
  }
}


export function createArc ({
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
    meta: Object.assign({}, meta)
  }
}


// ===== Porttypes =====

export const PORT_TYPES = {
  COLD: 'COLD',
  HOT: 'HOT',
  ACCUMULATOR: 'ACCUMULATOR'
}
