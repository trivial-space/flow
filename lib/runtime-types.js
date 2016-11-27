import { v4 } from './utils/uuid';
import { evaluate } from './utils/code-evaluator';
export function createEntity({ id = v4(), value, json, isEvent, meta }) {
    return {
        id,
        value,
        json,
        isEvent,
        meta: Object.assign({}, meta)
    };
}
export function createProcess({ id = v4(), ports = {}, procedure, code, autostart = false, async = false, meta }, context) {
    if (procedure == null && code != null) {
        procedure = evaluate(code, context);
    }
    if (code == null && procedure)
        code = procedure.toString();
    if (code == null || procedure == null) {
        throw TypeError('Process must have procedure or code set');
    }
    return {
        id,
        ports,
        procedure,
        code,
        autostart,
        async,
        meta: Object.assign({}, meta)
    };
}
export function createArc({ id, entity, process, port, meta, }) {
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
        id,
        entity,
        process,
        port,
        meta: Object.assign({}, meta)
    };
}
export const PORT_TYPES = {
    COLD: 'COLD',
    HOT: 'HOT',
    ACCUMULATOR: 'ACCUMULATOR'
};
//# sourceMappingURL=runtime-types.js.map