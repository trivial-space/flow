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
import { v4 } from 'tvs-libs/dist/lib/utils/uuid';
var streamNameSuffix = 'Stream';
var reactionNameSuffix = 'Reaction';
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
function createEntityRef(spec) {
    var value = spec.value;
    var id = v4();
    var ns;
    var accept;
    var reset;
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
    entity.updateVal = function (fn) {
        value = fn(value);
        return entity;
    };
    entity.accept = function (a) {
        accept = a;
        return entity;
    };
    entity.reset = function () {
        reset = true;
        return entity;
    };
    entity.getId = function () { return id; };
    if (spec.procedure) {
        streams.push(spec);
    }
    entity.react = function (dependencies, procedure, processId) {
        var spec = getStreamSpec(dependencies, procedure, processId);
        spec.pidSuffix = reactionNameSuffix;
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
        graph.entities[id] = createEntity({ id: id, value: value, accept: accept, reset: reset });
        streams.forEach(function (streamSpec) {
            var deps = streamSpec.dependencies;
            var pid = streamSpec.processId ?
                mergePath(streamSpec.processId, ns) :
                id + streamSpec.pidSuffix + (deps && deps.length
                    ? ':' + (deps.reduce(function (name, dep) {
                        var depId = dep.entity.getId();
                        if (depId === id) {
                            return name;
                        }
                        return name + ':' + depId;
                    }, ''))
                    : '');
            var ports = [];
            if (deps) {
                deps.forEach(function (port, portId) {
                    ports[portId] = port.type;
                    if (port.type !== PORT_TYPES.ACCUMULATOR) {
                        var arc_1 = createArc({
                            process: pid,
                            entity: port.entity.getId(),
                            port: portId
                        });
                        graph.arcs[arc_1.id] = arc_1;
                    }
                });
            }
            var arc = createArc({ process: pid, entity: id });
            graph.arcs[arc.id] = arc;
            graph.processes[pid] = createProcess({
                id: pid,
                ports: ports,
                procedure: streamSpec.procedure,
                async: streamSpec.async,
                autostart: streamSpec.autostart,
                delta: streamSpec.delta
            });
        });
        return graph;
    };
    return entity;
}
export function val(value) {
    return createEntityRef({ value: value });
}
function getStreamSpec(dependencies, procedure, processId) {
    var spec = {
        procedure: procedure
    };
    if (dependencies != null && dependencies.length) {
        spec.dependencies = dependencies;
    }
    if (typeof processId === 'string') {
        spec.processId = processId;
    }
    else {
        spec.pidSuffix = streamNameSuffix;
    }
    return spec;
}
export var stream = (function (dependencies, procedure, processId) {
    return createEntityRef(getStreamSpec(dependencies, procedure, processId));
});
export var asyncStream = (function (dependencies, procedure, processId) {
    return createEntityRef(__assign({}, getStreamSpec(dependencies, procedure, processId), { async: true }));
});
export var streamStart = (function (dependencies, procedure, processId) {
    return createEntityRef(__assign({}, getStreamSpec(dependencies, procedure, processId), { autostart: true }));
});
export var asyncStreamStart = (function (dependencies, procedure, processId) {
    return createEntityRef(__assign({}, getStreamSpec(dependencies, procedure, processId), { async: true, autostart: true }));
});
export var delta = function (entity, procedure, processId) { return createEntityRef(__assign({}, getStreamSpec([entity.HOT], procedure, processId), { delta: true })); };
export function isEntity(e) {
    return e &&
        typeof e.id === 'function' &&
        typeof e.getGraph === 'function' &&
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