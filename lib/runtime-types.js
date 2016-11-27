import { v4 } from './utils/uuid';
import { evaluate } from './utils/code-evaluator';
export function createEntity(_a) {
    var _b = _a.id, id = _b === void 0 ? v4() : _b, value = _a.value, json = _a.json, isEvent = _a.isEvent, meta = _a.meta;
    return {
        id: id,
        value: value,
        json: json,
        isEvent: isEvent,
        meta: Object.assign({}, meta)
    };
}
export function createProcess(_a, context) {
    var _b = _a.id, id = _b === void 0 ? v4() : _b, _c = _a.ports, ports = _c === void 0 ? {} : _c, procedure = _a.procedure, code = _a.code, _d = _a.autostart, autostart = _d === void 0 ? false : _d, _e = _a.async, async = _e === void 0 ? false : _e, meta = _a.meta;
    if (procedure == null && code != null) {
        procedure = evaluate(code, context);
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
export function createArc(_a) {
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
export var PORT_TYPES = {
    COLD: 'COLD',
    HOT: 'HOT',
    ACCUMULATOR: 'ACCUMULATOR'
};
//# sourceMappingURL=runtime-types.js.map