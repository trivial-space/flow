import { PORT_TYPES } from '../runtime-types';
var processNameSuffix = "Stream";
function mergePath(id, path) {
    return path ? path + '.' + id : id;
}
export function create(flow) {
    var SELF = {
        type: PORT_TYPES.ACCUMULATOR
    };
    function entity(value) {
        var id;
        var json;
        var isEvent;
        var idCallbacks = [];
        var ref = {};
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
            id && flow.addEntity({ id: id, value: value, json: json, isEvent: isEvent });
        }
        ref.getId = function () { return id; };
        ref.onId = function (cb) {
            idCallbacks.push(cb);
            id && cb(id);
        };
        ref.id = function (_id) {
            id && id != _id && flow.removeEntity(id);
            id = _id;
            updateEntity();
            idCallbacks.forEach(function (cb) { return cb(id); });
            return ref;
        };
        ref.value = function (_value) {
            value = _value;
            updateEntity();
            return ref;
        };
        ref.json = function (_json) {
            json = _json;
            updateEntity();
            return ref;
        };
        ref.isEvent = function (_isEvent) {
            if (_isEvent === void 0) { _isEvent = true; }
            isEvent = _isEvent;
            updateEntity();
            return ref;
        };
        ref.stream = function (spec) {
            ref.onId(function (id) {
                var procedure = spec.do;
                var pid = spec.id || id + processNameSuffix;
                var ports;
                if (spec.with) {
                    ports = {};
                    for (var portId in spec.with) {
                        var port = spec.with[portId];
                        ports[portId] = port.type;
                    }
                }
                flow.addProcess({
                    id: pid,
                    procedure: procedure,
                    ports: ports,
                    async: spec.async,
                    autostart: spec.autostart
                });
                flow.addArc({ process: pid, entity: id });
                if (spec.with) {
                    var _loop_1 = function (portId) {
                        var dep = spec.with[portId];
                        if (dep.type !== SELF.type) {
                            dep.entity.onId(function (id) {
                                flow.addArc({
                                    entity: id,
                                    process: pid,
                                    port: portId
                                });
                            });
                        }
                    };
                    for (var portId in spec.with) {
                        _loop_1(portId);
                    }
                }
            });
            return ref;
        };
        return ref;
    }
    entity.SELF = SELF;
    function addToFlow(es, path) {
        for (var id in es) {
            var e = es[id];
            if (typeof e.id === "function" && e.HOT && e.COLD && e.SELF) {
                var eid = mergePath(id, path);
                e.id(eid);
            }
        }
    }
    return {
        entity: entity,
        addToFlow: addToFlow,
        SELF: SELF
    };
}
//# sourceMappingURL=entity-reference.js.map