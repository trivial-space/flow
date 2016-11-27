import { PORT_TYPES, } from '../runtime-types';
const processNameSuffix = "Stream";
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
export function create(flow) {
    const SELF = {
        type: PORT_TYPES.ACCUMULATOR
    };
    function entity(value) {
        var id;
        var json;
        var isEvent;
        var idCallbacks = [];
        const ref = {};
        ref.HOT = {
            type: PORT_TYPES.HOT,
            entity: ref
        };
        ref.COLD = {
            type: PORT_TYPES.COLD,
            entity: ref
        };
        ref.SELF = SELF;
        function updateEntity() {
            id && flow.addEntity({ id, value, json, isEvent });
        }
        ref.getId = () => id;
        ref.onId = (cb) => {
            idCallbacks.push(cb);
            id && cb(id);
        };
        ref.id = (_id) => {
            id && id != _id && flow.removeEntity(id);
            id = _id;
            updateEntity();
            idCallbacks.forEach(cb => cb(id));
            return ref;
        };
        ref.value = (_value) => {
            value = _value;
            updateEntity();
            return ref;
        };
        ref.json = (_json) => {
            json = _json;
            updateEntity();
            return ref;
        };
        ref.isEvent = (_isEvent = true) => {
            isEvent = _isEvent;
            updateEntity();
            return ref;
        };
        ref.stream = (spec) => {
            ref.onId(id => {
                const procedure = spec.do;
                const pid = spec.id || id + processNameSuffix;
                let ports;
                if (spec.with) {
                    ports = {};
                    for (let portId in spec.with) {
                        const port = spec.with[portId];
                        ports[portId] = port.type;
                    }
                }
                flow.addProcess({
                    id: pid,
                    procedure,
                    ports,
                    async: spec.async,
                    autostart: spec.autostart
                });
                flow.addArc({ process: pid, entity: id });
                if (spec.with) {
                    for (let portId in spec.with) {
                        const dep = spec.with[portId];
                        if (dep.type !== SELF.type) {
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
            return ref;
        };
        return ref;
    }
    entity.SELF = SELF;
    function addToFlow(es, path) {
        for (let id in es) {
            const e = es[id];
            if (typeof e.id === "function" && e.HOT && e.COLD && e.SELF) {
                const eid = mergePath(id, path);
                e.id(eid);
            }
        }
    }
    return {
        entity: entity,
        addToFlow,
        SELF
    };
}
//# sourceMappingURL=entity-reference.js.map