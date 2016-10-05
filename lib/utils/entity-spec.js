var processNameSuffix = "Stream";
var portTypeMap = {
    H: "HOT",
    C: "COLD",
    A: "ACCUMULATOR"
};
function parseDepsString(str) {
    var _a = str.split(' '), type = _a[0], eid = _a[1];
    var portType = portTypeMap[type.toUpperCase()];
    return { type: portType, eid: eid };
}
function mergePath(id, path) {
    return path + '.' + id;
}
export function processProcessSpec(eid, spec, path) {
    if (path) {
        eid = mergePath(eid, path);
    }
    var pid = spec.id || eid + processNameSuffix;
    var process = {
        id: pid,
        procedure: spec.do
    };
    var graph = {
        entities: [],
        processes: [process],
        arcs: [{
                process: pid,
                entity: eid
            }]
    };
    if (spec.autostart) {
        process.autostart = spec.autostart;
    }
    if (spec.async) {
        process.async = spec.async;
    }
    if (spec.meta) {
        process.meta = spec.meta;
    }
    if (spec.with) {
        process.ports = {};
        for (var portId in spec.with) {
            var port = parseDepsString(spec.with[portId]);
            process.ports[portId] = port.type;
            if (port.eid) {
                if (port.eid.indexOf('#') === 0) {
                    var depId = port.eid.substr(1);
                    port.eid = path ? mergePath(depId, path) : depId;
                }
                graph.arcs.push({
                    entity: port.eid,
                    process: pid,
                    port: portId
                });
            }
        }
    }
    return graph;
}
function newGraph() {
    return {
        entities: [],
        processes: [],
        arcs: []
    };
}
function mergeGraphs(g1, g2) {
    return {
        entities: g1.entities.concat(g2.entities),
        processes: g1.processes.concat(g2.processes),
        arcs: g1.arcs.concat(g2.arcs)
    };
}
export function processEntitySpec(eid, spec, path) {
    var graph = newGraph();
    var id = path ? mergePath(eid, path) : eid;
    var entity = { id: id };
    if (spec.val != null) {
        entity.value = spec.val;
    }
    if (spec.json) {
        entity.json = spec.json;
    }
    if (spec.isEvent) {
        entity.isEvent = spec.isEvent;
    }
    if (spec.meta) {
        entity.meta = spec.meta;
    }
    if (spec.stream) {
        graph = mergeGraphs(graph, processProcessSpec(eid, spec.stream, path));
    }
    if (spec.streams) {
        graph = spec.streams
            .map(function (pSpec) { return processProcessSpec(eid, pSpec, path); })
            .map(function (graph, i) {
            graph.processes[0].id += i + 1;
            graph.arcs.forEach(function (a) { return a.process += i + 1; });
            return graph;
        })
            .reduce(mergeGraphs, graph);
    }
    graph.entities.push(entity);
    return graph;
}
export function toGraph(spec, path) {
    return Object.keys(spec)
        .map(function (id) { return processEntitySpec(id, spec[id], path); })
        .reduce(mergeGraphs, newGraph());
}
//# sourceMappingURL=entity-spec.js.map