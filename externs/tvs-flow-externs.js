var tvsFlow = {};

tvsFlow.create = function() {

  return {
    addEntity: function() {},
    removeEntity: function() {},
    addProcess: function() {},
    removeProcess: function() {},
    addArc: function() {},
    removeArc: function() {},
    addGraph: function() {},

    getState: function() {},
    getGraph: function() {},
    getMeta: function() {},
    setMeta: function() {},

    get: function() {},
    set: function() {},
    update: function() {},
    on: function() {},
    off: function() {},

    start: function() {},
    stop: function() {},

    PORT_TYPES: {
      HOT: "",
      COLD: "",
      ACCUMULATOR: ""
    }
  }
}
