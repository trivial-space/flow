import uuid from 'uuid'
import Evaluator from './utils/code-evaluator'

// ===== entity system types =====

function createEntity ({
  id = uuid.v4(),
  value,
  meta
}) {
  return {
    id,
    value,
    meta: {...meta},
    processes: {}
  }
}


function createProcess ({
  id = uuid.v4(),
  ports = {},
  procedure,
  code,
  meta
}) {

  // required properties
  if (!((procedure != null) || (code != null))) {
    throw Error("procedure or code property must be set on this process " + id)
  }

  // calculated values
  if (code == null) code = procedure.toString()
  if (procedure == null) {
    procedure = Evaluator.evaluate(code)
  }

  return {
    id,
    ports,
    procedure,
    code,
    meta: {...meta},
    out: function() {},
    entities: {}
  }
}


function createArc ({
  id = uuid.v4(),
  entity,
  process,
  port,
  meta,
}) {
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
