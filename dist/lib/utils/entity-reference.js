var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as graphs from './graph-utils';
import { PORT_TYPES, createEntity, createProcess, createArc } from '../runtime-types';
import { v4 } from "./uuid";
var streamNameSuffix = "Stream";
var reactionNameSuffix = "Reaction";
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
function createEntityRef(spec) {
    var value = spec.value;
    var id = v4();
    var ns;
    var reactionCount = 0;
    var streams = [];
    var entity = {};
    entity.HOT = {
        entity: entity,
        type: PORT_TYPES.HOT
    };
    entity.COLD = {
        entity: entity,
        type: PORT_TYPES.COLD
    };
    entity.id = function (_id, _ns) {
        id = mergePath(_id, _ns);
        ns = _ns;
        return entity;
    };
    entity.val = function (_value) {
        value = _value;
        return entity;
    };
    entity.getId = function () { return id; };
    if (spec.procedure) {
        streams.push(spec);
    }
    entity.react = function (a1, a2, a3) {
        var spec = getStreamSpec(a1, a2, a3);
        spec.pidSuffix = reactionNameSuffix + reactionCount++;
        var deps = spec.dependencies;
        spec.dependencies = [{ entity: entity, type: PORT_TYPES.ACCUMULATOR }];
        if (deps && deps.length) {
            spec.dependencies = spec.dependencies.concat(deps);
        }
        streams.push(spec);
        return entity;
    };
    entity.getGraph = function () {
        var graph = graphs.empty();
        graph.entities[id] = createEntity({ id: id, value: value });
        streams.forEach(function (streamSpec) {
            var pid = streamSpec.processId ?
                mergePath(streamSpec.processId, ns) :
                id + streamSpec.pidSuffix;
            var deps = streamSpec.dependencies;
            var ports = [];
            if (deps) {
                for (var portId in deps) {
                    var port = deps[portId];
                    ports[portId] = port.type;
                    if (port.type !== PORT_TYPES.ACCUMULATOR) {
                        var arc_1 = createArc({ process: pid, entity: port.entity.getId(), port: portId });
                        graph.arcs[arc_1.id] = arc_1;
                    }
                }
            }
            var arc = createArc({ process: pid, entity: id });
            graph.arcs[arc.id] = arc;
            graph.processes[pid] = createProcess({
                id: pid,
                ports: ports,
                procedure: streamSpec.procedure,
                async: streamSpec.async,
                autostart: streamSpec.autostart
            });
        });
        return graph;
    };
    return entity;
}
export function val(value) {
    return createEntityRef({ value: value });
}
function getStreamSpec(a1, a2, a3) {
    if (typeof a1 === "function") {
        return ({
            procedure: a1,
            pidSuffix: streamNameSuffix
        });
    }
    else if (Array.isArray(a1) && typeof a2 === "function") {
        return ({
            dependencies: a1,
            procedure: a2,
            pidSuffix: streamNameSuffix
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
export function stream(a1, a2, a3) {
    return createEntityRef(getStreamSpec(a1, a2, a3));
}
export function asyncStream(a1, a2, a3) {
    return createEntityRef(__assign({}, getStreamSpec(a1, a2, a3), { async: true }));
}
export function streamStart(a1, a2, a3) {
    return createEntityRef(__assign({}, getStreamSpec(a1, a2, a3), { autostart: true }));
}
export function asyncStreamStart(a1, a2, a3) {
    return createEntityRef(__assign({}, getStreamSpec(a1, a2, a3), { async: true, autostart: true }));
}
export function isEntity(e) {
    return e &&
        typeof e.id === "function" &&
        typeof e.getGraph === "function" &&
        e.HOT && e.COLD;
}
export function resolveEntityIds(entities, path) {
    for (var id in entities) {
        var e = entities[id];
        if (isEntity(e)) {
            e.id(id, path);
        }
    }
    return entities;
}
export function getGraphFromAll(entities) {
    var es = [];
    for (var id in entities) {
        var e = entities[id];
        if (isEntity(e)) {
            es.push(e);
        }
    }
    return es.reduce(function (g, e) { return graphs.merge(g, e.getGraph()); }, graphs.empty());
}
//# sourceMappingURL=entity-reference.js.map