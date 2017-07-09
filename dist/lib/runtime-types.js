var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { v4 } from './utils/uuid';
import { evaluate } from './utils/code-evaluator';
export function createEntity(_a) {
    var _b = _a.id, id = _b === void 0 ? v4() : _b, value = _a.value, json = _a.json, accept = _a.accept, reset = _a.reset, meta = _a.meta;
    if (value == null && json) {
        value = JSON.parse(json);
    }
    return {
        id: id,
        value: value,
        accept: accept,
        reset: reset,
        meta: __assign({}, meta)
    };
}
export function createProcess(_a, context) {
    var _b = _a.id, id = _b === void 0 ? v4() : _b, _c = _a.ports, ports = _c === void 0 ? [] : _c, procedure = _a.procedure, code = _a.code, _d = _a.autostart, autostart = _d === void 0 ? false : _d, _e = _a.async, async = _e === void 0 ? false : _e, _f = _a.delta, delta = _f === void 0 ? false : _f, meta = _a.meta;
    if (procedure == null && code != null) {
        procedure = evaluate(code, context);
    }
    if (procedure == null) {
        throw TypeError('Process must have procedure or code set');
    }
    if (delta && !ports.length) {
        ports.push(PORT_TYPES.HOT);
    }
    return {
        id: id,
        ports: ports,
        procedure: procedure,
        autostart: autostart,
        async: async,
        delta: delta,
        meta: __assign({}, meta)
    };
}
export function createArc(_a) {
    var id = _a.id, entity = _a.entity, process = _a.process, port = _a.port, meta = _a.meta;
    if (entity == null) {
        throw TypeError('no entity specified in arc ' + id);
    }
    if (process == null) {
        throw TypeError('no process specified in arc ' + id);
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
        meta: __assign({}, meta)
    };
}
export var PORT_TYPES = {
    COLD: 'COLD',
    HOT: 'HOT',
    ACCUMULATOR: 'ACCUMULATOR'
};
//# sourceMappingURL=runtime-types.js.map