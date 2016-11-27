import { PORT_TYPES } from "../runtime-types";
const processNameSuffix = "Stream";
const portTypeMap = {
    H: PORT_TYPES.HOT,
    C: PORT_TYPES.COLD,
    A: PORT_TYPES.ACCUMULATOR
};
function parseDepsString(str) {
    const [type, eid] = str.split(' ');
    const portType = portTypeMap[type.toUpperCase()];
    return { type: portType, eid };
}
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
function resolvePath(id, path) {
    const prefix = /^\.*/.exec(id);
    const length = prefix ? prefix[0].length : 0;
    const depId = id.substr(length);
    if (path) {
        const steps = path.trim().split('.');
        for (let i = 0; i < length - 1; i++) {
            steps.pop();
        }
        path = steps.join('.');
        return mergePath(depId, path);
    }
    return depId;
}
export function processProcessSpec(eid, spec, path) {
    eid = mergePath(eid, path);
    const pid = spec.id || eid + processNameSuffix;
    const process = {
        id: pid,
        procedure: spec.do
    };
    const graph = {
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
        for (let portId in spec.with) {
            const port = parseDepsString(spec.with[portId]);
            process.ports[portId] = port.type;
            if (port.eid) {
                if (port.eid.indexOf('.') === 0) {
                    port.eid = resolvePath(port.eid, path);
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
    let graph = newGraph();
    const id = mergePath(eid, path);
    const entity = { id };
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
            .map(pSpec => processProcessSpec(eid, pSpec, path))
            .map((graph, i) => {
            graph.processes[0].id += i + 1;
            graph.arcs.forEach(a => a.process += i + 1);
            return graph;
        })
            .reduce(mergeGraphs, graph);
    }
    graph.entities.push(entity);
    return graph;
}
export function toGraph(spec, path) {
    return Object.keys(spec)
        .map(id => processEntitySpec(id, spec[id], path))
        .reduce(mergeGraphs, newGraph());
}
//# sourceMappingURL=entity-spec.js.map