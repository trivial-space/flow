var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
export function empty() {
    return {
        entities: {},
        processes: {},
        arcs: {},
        meta: {}
    };
}
export function merge(g1, g2) {
    return {
        entities: __assign({}, g1.entities, g2.entities),
        processes: __assign({}, g1.processes, g2.processes),
        arcs: __assign({}, g1.arcs, g2.arcs),
        meta: __assign({}, g1.meta, g2.meta)
    };
}
//# sourceMappingURL=graph-utils.js.map