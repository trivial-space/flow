(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tvsFlow"] = factory();
	else
		root["tvsFlow"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _runtime = __webpack_require__(1);

	var _runtime2 = _interopRequireDefault(_runtime);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _runtime2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _runtimeTypes = __webpack_require__(2);

	var _runtimeTypes2 = _interopRequireDefault(_runtimeTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function create() {

	  var entities = {},
	      processes = {},
	      arcs = {},
	      meta = {},
	      context = null,
	      engine = {
	    es: {},
	    ps: {}
	  },
	      debug = false;

	  function getGraph() {
	    return { entities: entities, processes: processes, arcs: arcs, meta: meta };
	  }

	  function getState() {
	    var state = {};
	    for (var eId in engine.es) {
	      state[eId] = engine.es[eId].val;
	    }
	    return state;
	  }

	  function getContext() {
	    return context;
	  }

	  function setContext(ctx) {
	    context = ctx;
	  }

	  function getMeta() {
	    return meta;
	  }

	  function setMeta(newMeta) {
	    if (newMeta != null && (typeof newMeta === "undefined" ? "undefined" : _typeof(newMeta)) === "object" && !(newMeta instanceof Array)) {
	      meta = _extends({}, meta, newMeta);
	    }
	  }

	  function setDebug(isDebug) {
	    debug = isDebug;
	  }

	  // ===== entity operations =====

	  function get(id) {
	    return engine.es[id] && engine.es[id].val;
	  }

	  function set(id, value) {
	    var eE = engineE(id);
	    eE.val = value;
	    touchEntity(eE);
	    flush();
	  }

	  function update(id, fn) {
	    set(id, fn(get(id)));
	  }

	  function on(id, cb) {
	    var eE = engineE(id);
	    eE.cb = cb;
	  }

	  function off(id) {
	    var eE = engineE(id);
	    delete eE.cb;
	  }

	  // ===== update flow topology =====

	  function addEntity(spec) {
	    var e = _runtimeTypes2.default.createEntity(spec);
	    entities[e.id] = e;

	    var eE = engineE(e.id);
	    eE.event = e.isEvent;

	    if (e.value != null && eE.val == null) {
	      eE.val = e.value;
	      touchEntity(eE);
	    }

	    if (e.json != null && eE.val == null) {
	      eE.val = JSON.parse(e.json);
	      touchEntity(eE);
	    }
	    return e;
	  }

	  function removeEntity(id) {
	    var eE = engineE(id);
	    for (var aId in eE.arcs) {
	      removeArc(aId);
	    }
	    delete engine.es[id];
	    delete entities[id];
	  }

	  function addProcess(spec) {
	    var p = _runtimeTypes2.default.createProcess(spec, context);
	    processes[p.id] = p;
	    var eP = engineP(p.id);

	    eP.acc = null;
	    eP.async = p.async;

	    // cleanup unused arcs
	    var portNames = Object.keys(p.ports);
	    for (var aId in eP.arcs) {
	      var port = arcs[aId].port;
	      if (port && (portNames.indexOf(port) < 0 || p.ports[port] === _runtimeTypes2.default.PORT_TYPES.ACCUMULATOR)) {
	        removeArc(aId);
	      }
	    }

	    // set accumulator if present
	    for (var portId in p.ports) {
	      if (p.ports[portId] === _runtimeTypes2.default.PORT_TYPES.ACCUMULATOR) {
	        eP.acc = portId;
	      }
	    }

	    // readjust already present arc
	    for (var _aId in eP.arcs) {
	      updateArc(arcs[_aId]);
	    }

	    return p;
	  }

	  function removeProcess(id) {
	    var eP = engineP(id);
	    eP.stop && eP.stop();
	    for (var aId in eP.arcs) {
	      removeArc(aId);
	    }
	    delete engine.ps[id];
	    delete processes[id];
	  }

	  function addArc(spec) {
	    var arc = _runtimeTypes2.default.createArc(spec);
	    arcs[arc.id] = arc;
	    updateArc(arc);

	    // autostart
	    var eP = engineP(arc.process),
	        p = processes[arc.process];
	    if (p && p.autostart === true && Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
	      autostart(eP);
	    }

	    return arc;
	  }

	  function removeArc(id) {
	    var arc = arcs[id];

	    if (arc) {
	      var eP = engineP(arc.process),
	          eE = engineE(arc.entity);

	      delete eP.arcs[id];
	      delete eE.arcs[id];

	      if (arc.port) {
	        delete eE.effects[arc.process];
	        delete eP.sources[arc.port];
	        delete eP.values[arc.port];
	      } else {
	        eP.sink = function () {};
	        delete eP.out;
	        delete eE.reactions[arc.process];
	      }
	    }
	    delete arcs[id];
	  }

	  function updateArc(arc) {
	    var pId = arc.process,
	        eId = arc.entity,
	        eP = engineP(pId),
	        eE = engineE(eId),
	        p = processes[pId];

	    eE.arcs[arc.id] = true;

	    if (p) {

	      eP.arcs[arc.id] = true;

	      // from entity to process
	      if (arc.port) {
	        eP.sources[arc.port] = eE;
	        if (p.ports[arc.port] == _runtimeTypes2.default.PORT_TYPES.HOT) {
	          eE.effects[pId] = eP;
	        } else {
	          delete eE.effects[pId];
	        }

	        // from process to entity
	      } else {
	          eP.sink = function (value) {
	            eE.val = value;
	            touchEntity(eE);
	            flush();
	          };
	          eP.out = eE;
	          if (eP.acc) {
	            eP.sources[eP.acc] = eE;
	            eE.reactions[pId] = eP;
	          } else {
	            delete eE.reactions[pId];
	          }
	        }
	    }
	  }

	  function addGraph(graphSpec) {
	    if (graphSpec.entities) {
	      for (var i in graphSpec.entities) {
	        addEntity(graphSpec.entities[i]);
	      }
	    }
	    if (graphSpec.processes) {
	      for (var _i in graphSpec.processes) {
	        addProcess(graphSpec.processes[_i]);
	      }
	    }
	    if (graphSpec.arcs) {
	      for (var _i2 in graphSpec.arcs) {
	        addArc(graphSpec.arcs[_i2]);
	      }
	    }
	    if (graphSpec.meta) {
	      setMeta(graphSpec.meta);
	    }
	    flush();
	  }

	  // ===== flow execution =====

	  var touchedEntities = {};

	  function touchEntity(eE, eP) {
	    touchedEntities[eE.id] = eP || true;
	  }

	  function getSchedule(_ref) {
	    var syncSchedule = _ref.syncSchedule;
	    var asyncSchedule = _ref.asyncSchedule;
	    var callbacks = _ref.callbacks;
	    var activeEntities = _ref.activeEntities;
	    var eE = _ref.eE;
	    var _ref$level = _ref.level;
	    var level = _ref$level === undefined ? 0 : _ref$level;
	    var pLast = _ref.pLast;

	    activeEntities[eE.id] = true;

	    if (eE.cb) {
	      callbacks[eE.id] = eE;
	    }

	    if (!pLast || !pLast.acc) {
	      var inc = false;
	      for (var pId in eE.reactions) {
	        inc = true;
	        if (!syncSchedule[pId]) {
	          syncSchedule[pId] = { level: level, eP: eE.reactions[pId] };
	        } else if (syncSchedule[pId].level < level) {
	          syncSchedule[pId].level = level;
	        }
	      }

	      if (inc) level++;
	    }

	    for (var _pId in eE.effects) {
	      var eP = eE.effects[_pId];

	      if (eP.async) {
	        asyncSchedule[_pId] = eP;
	      } else {

	        if (!syncSchedule[_pId]) {
	          syncSchedule[_pId] = { level: level, eP: eP };
	        } else if (syncSchedule[_pId].level < level) {
	          syncSchedule[_pId].level = level;
	        }

	        if (eP.out) {
	          getSchedule({
	            syncSchedule: syncSchedule,
	            asyncSchedule: asyncSchedule,
	            callbacks: callbacks,
	            activeEntities: activeEntities,
	            eE: eP.out,
	            level: level + 1,
	            pLast: eP
	          });
	        }
	      }
	    }
	  }

	  function flush() {
	    if (debug) {
	      console.log("flushing graph with", touchedEntities);
	    }

	    var order = [],
	        callbacks = {},
	        syncSchedule = {},
	        asyncSchedule = {},
	        activeEntities = {};

	    for (var eId in touchedEntities) {
	      getSchedule({
	        syncSchedule: syncSchedule,
	        asyncSchedule: asyncSchedule,
	        callbacks: callbacks,
	        activeEntities: activeEntities,
	        eE: engine.es[eId],
	        level: 0,
	        pLast: touchedEntities[eId]
	      });
	    }

	    touchedEntities = {};

	    for (var _eId in syncSchedule) {
	      var step = syncSchedule[_eId];
	      if (order[step.level]) {
	        order[step.level].push(step.eP);
	      } else {
	        order[step.level] = [step.eP];
	      }
	    }

	    for (var i = 0; i < order.length; i++) {
	      for (var j = 0; j < order[i].length; j++) {
	        var eP = order[i][j];
	        execute(eP, activeEntities);
	      }
	    }

	    for (var _eId2 in callbacks) {
	      callbacks[_eId2].cb(callbacks[_eId2].val);
	    }

	    for (var pId in asyncSchedule) {
	      execute(asyncSchedule[pId], activeEntities);
	    }
	  }

	  function execute(eP, activeEntities) {
	    if (debug) {
	      console.log("executing process", eP.id);
	    }
	    for (var portId in eP.sources) {
	      var src = eP.sources[portId];
	      if (src.event && !(activeEntities && activeEntities[src.id])) {
	        eP.values[portId] = undefined;
	      } else {
	        eP.values[portId] = src.val;
	      }
	    }
	    if (eP.async) {
	      eP.stop && eP.stop();
	      eP.stop = processes[eP.id].procedure.call(context, eP.values, eP.sink);
	    } else {
	      var val = processes[eP.id].procedure.call(context, eP.values);
	      if (eP.out) eP.out.val = val;
	    }
	  }

	  function autostart(eP) {
	    if (eP.async) {
	      setTimeout(function () {
	        execute(eP);
	      }, 10);
	    } else {
	      execute(eP);
	      touchEntity(eP.out);
	    }
	  }

	  function start(processId) {
	    var eP = engineP(processId);
	    execute(eP);
	    if (eP.out && !eP.async) {
	      touchEntity(eP.out, eP);
	      flush();
	    }
	  }

	  function stop(processId) {
	    var eP = engineP(processId);
	    eP.stop && eP.stop();
	    delete eP.stop;
	  }

	  // ===== helpers =====

	  function engineE(id) {
	    if (!entities[id]) {
	      addEntity({ id: id });
	    }
	    return engine.es[id] || (engine.es[id] = {
	      id: id,
	      reactions: {},
	      effects: {},
	      arcs: {}
	    });
	  }

	  function engineP(id) {
	    return engine.ps[id] || (engine.ps[id] = {
	      id: id,
	      acc: null,
	      sources: {},
	      arcs: {},
	      values: {},
	      sink: function sink() {}
	    });
	  }

	  // ===== runtime api =====

	  return {

	    addEntity: addEntity,
	    removeEntity: removeEntity,
	    addProcess: addProcess,
	    removeProcess: removeProcess,
	    addArc: addArc,
	    removeArc: removeArc,
	    addGraph: addGraph,

	    getGraph: getGraph,
	    getState: getState,
	    setMeta: setMeta,
	    getMeta: getMeta,
	    getContext: getContext,
	    setContext: setContext,
	    setDebug: setDebug,

	    get: get,
	    set: set,
	    update: update,
	    on: on,
	    off: off,

	    start: start,
	    stop: stop,

	    PORT_TYPES: _extends({}, _runtimeTypes2.default.PORT_TYPES)
	  };
	}

	exports.default = {
	  create: create
	};
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _uuid = __webpack_require__(3);

	var _codeEvaluator = __webpack_require__(4);

	// ===== entity system types =====

	function createEntity(_ref) {
	  var _ref$id = _ref.id;
	  var id = _ref$id === undefined ? (0, _uuid.v4)() : _ref$id;
	  var value = _ref.value;
	  var json = _ref.json;
	  var isEvent = _ref.isEvent;
	  var meta = _ref.meta;

	  return {
	    id: id,
	    value: value,
	    json: json,
	    isEvent: isEvent,
	    meta: _extends({}, meta)
	  };
	}

	function createProcess(_ref2, context) {
	  var _ref2$id = _ref2.id;
	  var id = _ref2$id === undefined ? (0, _uuid.v4)() : _ref2$id;
	  var _ref2$ports = _ref2.ports;
	  var ports = _ref2$ports === undefined ? {} : _ref2$ports;
	  var procedure = _ref2.procedure;
	  var code = _ref2.code;
	  var autostart = _ref2.autostart;
	  var async = _ref2.async;
	  var meta = _ref2.meta;

	  // calculated values
	  if (code == null) code = procedure.toString();
	  if (procedure == null) {
	    procedure = (0, _codeEvaluator.evaluate)(code, context);
	  }

	  return {
	    id: id,
	    ports: ports,
	    procedure: procedure,
	    code: code,
	    autostart: autostart,
	    async: async,
	    meta: _extends({}, meta)
	  };
	}

	function createArc(_ref3) {
	  var id = _ref3.id;
	  var entity = _ref3.entity;
	  var process = _ref3.process;
	  var port = _ref3.port;
	  var meta = _ref3.meta;

	  if (entity == null) {
	    throw TypeError("no entity specified in arc " + id);
	  }
	  if (process == null) {
	    throw TypeError("no process specified in arc " + id);
	  }
	  if (id == null) {
	    if (port == null) {
	      id = process + '->' + entity;
	    } else {
	      id = entity + '->' + process + '::' + port;
	    }
	  }

	  return {
	    id: id,
	    entity: entity,
	    process: process,
	    port: port,
	    meta: _extends({}, meta)
	  };
	}

	// ===== Porttypes =====

	var PORT_TYPES = {
	  COLD: 'cold',
	  HOT: 'hot',
	  ACCUMULATOR: 'accumulator'
	};

	// ===== module interface =====

	exports.default = {
	  createEntity: createEntity,
	  createProcess: createProcess,
	  createArc: createArc,
	  PORT_TYPES: PORT_TYPES
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.v4 = v4;
	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	var _rnds = new Array(16),
	    _rng = function _rng() {
	  for (var i = 0, r; i < 16; i++) {
	    if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	    _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	  }

	  return _rnds;
	};

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf) {
	  var i = 0,
	      bth = _byteToHex;
	  return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v4()` - Generate random UUID**
	function v4() {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var rnds = _rng();
	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = rnds[6] & 0x0f | 0x40;
	  rnds[8] = rnds[8] & 0x3f | 0x80;
	  return unparse(rnds);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.evaluate = evaluate;
	function evaluate(code, context) {
	  var prefix = "(function(){ return ";
	  var postfix = "})";
	  var factory = eval(prefix + code + postfix);
	  return factory.call(context);
	}

/***/ }
/******/ ])
});
;