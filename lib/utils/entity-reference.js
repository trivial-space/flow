var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { PORT_TYPES } from '../runtime-types';
const streamNameSuffix = "Stream";
const reactionNameSuffix = "Reaction";
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
export function create(flow) {
    function createEntity(spec) {
        let isEvent;
        let id;
        let ns;
        let reactionCount = 0;
        const idCallbacks = [];
        const entity = {};
        entity.HOT = {
            entity,
            type: PORT_TYPES.HOT
        };
        entity.COLD = {
            entity,
            type: PORT_TYPES.COLD
        };
        function updateEntity() {
            id && flow.addEntity({
                id,
                isEvent,
                value: spec.value,
                json: spec.json
            });
        }
        entity.getId = () => id;
        entity.onId = (cb) => {
            idCallbacks.push(cb);
            id && cb(id);
        };
        entity.id = (_id, _ns) => {
            let tempId = mergePath(_id, _ns);
            if (id === tempId)
                return entity;
            id && flow.removeEntity(id);
            ns = _ns;
            id = tempId;
            updateEntity();
            idCallbacks.forEach(cb => cb(tempId));
            return entity;
        };
        entity.isEvent = (_isEvent = true) => {
            isEvent = _isEvent;
            updateEntity();
            return entity;
        };
        function registerStream(spec, suffix) {
            entity.onId(id => {
                const pid = spec.processId ? mergePath(spec.processId, ns) : id + suffix;
                const deps = spec.dependencies;
                let ports = [];
                if (deps) {
                    for (let portId in deps) {
                        const port = deps[portId];
                        ports[portId] = port.type;
                    }
                }
                flow.addProcess({
                    id: pid,
                    procedure: spec.procedure,
                    ports,
                    async: spec.async,
                    autostart: spec.autostart
                });
                flow.addArc({ process: pid, entity: id });
                if (deps) {
                    for (let portId in deps) {
                        const dep = deps[portId];
                        if (dep.type !== PORT_TYPES.ACCUMULATOR) {
                            dep.entity.onId(id => {
                                flow.addArc({
                                    entity: id,
                                    process: pid,
                                    port: portId
                                });
                            });
                        }
                    }
                }
            });
        }
        if (spec.procedure) {
            registerStream(spec, streamNameSuffix);
        }
        entity.react = (a1, a2, a3) => {
            const spec = getStreamSpec(a1, a2, a3);
            const deps = spec.dependencies;
            spec.dependencies = [{ entity, type: PORT_TYPES.ACCUMULATOR }];
            if (deps && deps.length) {
                spec.dependencies = spec.dependencies.concat(deps);
            }
            registerStream(spec, reactionNameSuffix + reactionCount++);
            return entity;
        };
        return entity;
    }
    function val(value) {
        return createEntity({ value });
    }
    function json(json) {
        return createEntity({ json });
    }
    function getStreamSpec(a1, a2, a3) {
        if (typeof a1 === "function") {
            return ({
                procedure: a1
            });
        }
        else if (Array.isArray(a1) && typeof a2 === "function") {
            return ({
                dependencies: a1,
                procedure: a2
            });
        }
        else if (typeof a1 === "string" && typeof a2 === "function") {
            return ({
                processId: a1,
                procedure: a2
            });
        }
        else if (typeof a1 === "string" && Array.isArray(a2) && typeof a3 === "function") {
            return ({
                processId: a1,
                dependencies: a2,
                procedure: a3
            });
        }
        else {
            throw TypeError('Wrong stream arguments');
        }
    }
    function stream(a1, a2, a3) {
        return createEntity(getStreamSpec(a1, a2, a3));
    }
    function asyncStream(a1, a2, a3) {
        return createEntity(__assign({}, getStreamSpec(a1, a2, a3), { async: true }));
    }
    function streamStart(a1, a2, a3) {
        return createEntity(__assign({}, getStreamSpec(a1, a2, a3), { autostart: true }));
    }
    function asyncStreamStart(a1, a2, a3) {
        return createEntity(__assign({}, getStreamSpec(a1, a2, a3), { async: true, autostart: true }));
    }
    function addToFlow(es, path) {
        for (let id in es) {
            const e = es[id];
            if (typeof e.id === "function" && e.HOT && e.COLD) {
                e.id(id, path);
            }
        }
    }
    return {
        val,
        json,
        stream,
        streamStart,
        asyncStream,
        asyncStreamStart,
        addToFlow
    };
}
//# sourceMappingURL=entity-reference.js.map