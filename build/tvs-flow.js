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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _runtimeTypes = __webpack_require__(2);

	var _runtimeTypes2 = _interopRequireDefault(_runtimeTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function create() {

	  var entities = {},
	      processes = {},
	      arcs = {},
	      meta = {},
	      graph = {
	    e: {},
	    p: {}
	  };

	  function getGraph() {
	    return { entities: entities, processes: processes, arcs: arcs, meta: meta };
	  }

	  function getState() {
	    var state = {};
	    for (var eId in graph.e) {
	      state[eId] = graph.e[eId].val;
	    }
	    return state;
	  }

	  function getMeta() {
	    return meta;
	  }

	  function setMeta(newMeta) {
	    if (newMeta != null && (typeof newMeta === "undefined" ? "undefined" : _typeof(newMeta)) === "object" && !(newMeta instanceof Array)) {
	      meta = _extends({}, meta, newMeta);
	    }
	  }

	  // ===== entity operations =====

	  function get(id) {
	    return graph.e[id] && graph.e[id].val;
	  }

	  function set(id, value) {
	    var gE = graphE(id);
	    gE.val = value;
	    for (var pId in gE.ps) {
	      start(pId);
	    }
	    if (gE.cb) {
	      gE.cb(gE.val);
	    }
	  }

	  function update(id, fn) {
	    set(id, fn(get(id)));
	  }

	  function on(id, cb) {
	    var gE = graphE(id);
	    gE.cb = cb;
	  }

	  function off(id) {
	    var gE = graphE(id);
	    delete gE.cb;
	  }

	  // ===== update flow topology =====

	  function addEntity(spec) {
	    var e = _runtimeTypes2.default.createEntity(spec);
	    entities[e.id] = e;
	    var gE = graphE(e.id);
	    if (e.value != null && gE.val == null) {
	      set(e.id, e.value);
	    }
	    return e;
	  }

	  function removeEntity(id) {
	    var gE = graphE(id);
	    for (var aId in gE.as) {
	      removeArc(aId);
	    }
	    delete graph.e[id];
	    delete entities[id];
	  }

	  function addProcess(spec) {
	    var p = _runtimeTypes2.default.createProcess(spec);
	    processes[p.id] = p;
	    var gP = graphP(p.id);

	    for (var portId in p.ports) {
	      if (p.ports[portId] === _runtimeTypes2.default.PORT_TYPES.ACCUMULATOR) {
	        gP.acc = portId;

	        // check if outputPort already connected
	        for (var aId in gP.as) {
	          var arc = arcs[aId];
	          if (arc.port == null) {
	            updateArc(arc);
	          }
	        }
	      }
	    }
	    return p;
	  }

	  function removeProcess(id) {
	    var gP = graphP(id);
	    for (var aId in gP.as) {
	      removeArc(aId);
	    }
	    delete graph.p[id];
	    delete processes[id];
	  }

	  function addArc(spec) {
	    var arc = _runtimeTypes2.default.createArc(spec);
	    arcs[arc.id] = arc;
	    updateArc(arc);
	    return arc;
	  }

	  function removeArc(id) {
	    var arc = arcs[id];

	    if (arc) {
	      var gP = graphP(arc.process),
	          gE = graphE(arc.entity);

	      delete gP.as[id];
	      delete gE.as[id];

	      if (arc.port) {
	        delete gE.ps[arc.process];
	        delete gP.es[arc.port];
	      } else {
	        gP.out = function () {};
	      }
	    }
	    delete arcs[id];
	  }

	  function updateArc(arc) {
	    var pId = arc.process,
	        eId = arc.entity,
	        gP = graphP(pId),
	        gE = graphE(eId),
	        p = processes[pId];

	    gE.as[arc.id] = true;

	    if (p) {

	      gP.as[arc.id] = true;

	      // from entity to process
	      if (arc.port) {
	        gP.es[arc.port] = eId;
	        if (p.ports[arc.port] == _runtimeTypes2.default.PORT_TYPES.HOT) {
	          gE.ps[pId] = true;
	        } else {
	          delete gE.ps[pId];
	        }

	        // from process to entity
	      } else {
	          gP.out = function (value) {
	            return set(eId, value);
	          };
	          if (gP.acc) {
	            gP.es[gP.acc] = eId;
	          }
	        }

	      // autostart
	      if (p.autostart === true && Object.keys(gP.as).length === Object.keys(p.ports).length + 1) {
	        start(p.id);
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
	  }

	  // ===== flow execution =====

	  function start(processId) {
	    var gP = graphP(processId);
	    var ports = {};
	    for (var portId in gP.es) {
	      ports[portId] = graph.e[gP.es[portId]].val;
	    }
	    gP.stop && gP.stop();
	    gP.stop = processes[processId].procedure(ports, gP.out);
	  }

	  function stop(processId) {
	    var gP = graphP(processId);
	    gP.stop && gP.stop();
	    delete gP.stop;
	  }

	  // ===== helpers =====

	  function graphE(id) {
	    if (!entities[id]) {
	      addEntity({ id: id });
	    }
	    return graph.e[id] || (graph.e[id] = {
	      ps: {},
	      as: {}
	    });
	  }

	  function graphP(id) {
	    return graph.p[id] || (graph.p[id] = {
	      acc: null,
	      es: {},
	      as: {},
	      out: function out() {}
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

	var _uuid2 = _interopRequireDefault(_uuid);

	var _codeEvaluator = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// ===== entity system types =====

	function createEntity(_ref) {
	  var _ref$id = _ref.id;
	  var id = _ref$id === undefined ? _uuid2.default.v4() : _ref$id;
	  var value = _ref.value;
	  var meta = _ref.meta;

	  return {
	    id: id,
	    value: value,
	    meta: _extends({}, meta)
	  };
	}

	function createProcess(_ref2) {
	  var _ref2$id = _ref2.id;
	  var id = _ref2$id === undefined ? _uuid2.default.v4() : _ref2$id;
	  var _ref2$ports = _ref2.ports;
	  var ports = _ref2$ports === undefined ? {} : _ref2$ports;
	  var procedure = _ref2.procedure;
	  var code = _ref2.code;
	  var autostart = _ref2.autostart;
	  var meta = _ref2.meta;


	  // calculated values
	  if (code == null) code = procedure.toString();
	  if (procedure == null) {
	    procedure = (0, _codeEvaluator.evaluate)(code);
	  }

	  return {
	    id: id,
	    ports: ports,
	    procedure: procedure,
	    code: code,
	    autostart: autostart,
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
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(4);

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || _rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	module.exports = uuid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;

	if (global.crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	module.exports = rng;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
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