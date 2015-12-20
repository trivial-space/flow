const uuid = require('uuid')


// ===== entity system types =====

const ActionTypes = {
  ACTION: "ts.entitysystem/action",
  FACTORY: "ts.entitysystem/factory",
  REACTION: "ts.entitysystem/reaction",
  CALLBACK: "ts.entitysystem/callback",
  OSCILLATOR: 'ts.entitysystem/oscillator'
}


function createEntity ({
  id = uuid.v4(),
  name,
  namespace,
  initialValue: value
}) {

  return {
    id,
    value,
    name,
    namespace,
    factory: null,
    dependencies: null,
    effects: null,
    callbacks: null
  }
}


function createAction ({
  id = uuid.v4(),
  dependencies,
  procedure
}) {

  return {
    id,
    procedure,
    dependencies,
    type: ActionTypes.ACTION
  }
}


function createFactory ({
  id = uuid.v4(),
  receiver = uuid.v4(),
  dependencies = [],
  procedure
}) {

  return {
    id,
    receiver,
    procedure,
    dependencies,
    type: ActionTypes.FACTORY
  }
}


function createReaction ({
  id = uuid.v4(),
  receiver = uuid.v4(),
  triggers,
  supplements = [],
  procedure,
}) {

  const dependencies = [receiver, ...triggers, ...supplements]

  return {
    id,
    receiver,
    procedure,
    dependencies,
    triggers,
    supplements,
    type: ActionTypes.REACTION
  }
}


function createCallback ({
  id = uuid.v4(),
  triggers,
  procedure,
  supplements = []
}) {

  const dependencies = [...triggers, ...supplements]

  return {
    id,
    procedure,
    dependencies,
    triggers,
    supplements,
    type: ActionTypes.CALLBACK
  }
}


function createOscillator ({
  id = uuid.v4(),
  receiver = uuid.v4(),
  target = uuid.v4(),
  dependencies = [],
  procedure
}) {

  return {
    id,
    receiver,
    target,
    procedure,
    dependencies,
    type: ActionTypes.OSCILLATOR
  }
}

// ===== module interface =====

module.exports = {
  ActionTypes,
  createEntity,
  createAction,
  createFactory,
  createReaction,
  createCallback,
  createOscillator
}
