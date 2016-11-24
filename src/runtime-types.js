"use strict";
var uuid_1 = require("./utils/uuid");
var code_evaluator_1 = require("./utils/code-evaluator");
function createEntity(_a) {
    var _b = _a.id, id = _b === void 0 ? uuid_1.v4() : _b, value = _a.value, json = _a.json, isEvent = _a.isEvent, meta = _a.meta;
    return {
        id: id,
        value: value,
        json: json,
        isEvent: isEvent,
        meta: Object.assign({}, meta)
    };
}
exports.createEntity = createEntity;
function createProcess(_a, context) {
    var _b = _a.id, id = _b === void 0 ? uuid_1.v4() : _b, _c = _a.ports, ports = _c === void 0 ? {} : _c, procedure = _a.procedure, code = _a.code, _d = _a.autostart, autostart = _d === void 0 ? false : _d, _e = _a.async, async = _e === void 0 ? false : _e, meta = _a.meta;
    if (procedure == null && code != null) {
        procedure = code_evaluator_1.evaluate(code, context);
    }
    if (code == null && procedure)
        code = procedure.toString();
    if (code == null || procedure == null) {
        throw TypeError('Process must have procedure or code set');
    }
    return {
        id: id,
        ports: ports,
        procedure: procedure,
        code: code,
        autostart: autostart,
        async: async,
        meta: Object.assign({}, meta)
    };
}
exports.createProcess = createProcess;
function createArc(_a) {
    var id = _a.id, entity = _a.entity, process = _a.process, port = _a.port, meta = _a.meta;
    if (entity == null) {
        throw TypeError("no entity specified in arc " + id);
    }
    if (process == null) {
        throw TypeError("no process specified in arc " + id);
    }
    if (id == null) {
        if (port == null) {
            id = process + '->' + entity;
        }
        else {
            id = entity + '->' + process + '::' + port;
        }
    }
    return {
        id: id,
        entity: entity,
        process: process,
        port: port,
        meta: Object.assign({}, meta)
    };
}
exports.createArc = createArc;
exports.PORT_TYPES = {
    COLD: 'COLD',
    HOT: 'HOT',
    ACCUMULATOR: 'ACCUMULATOR'
};
