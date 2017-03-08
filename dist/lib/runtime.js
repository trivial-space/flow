var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as types from './runtime-types';
export function create() {
    var entities = {}, processes = {}, arcs = {}, meta = {}, context = null, engine = {
        es: {},
        ps: {},
    }, debug = false;
    function getGraph() {
        return { entities: entities, processes: processes, arcs: arcs, meta: meta };
    }
    function getState() {
        var state = {};
        for (var eId in engine.es) {
            state[eId] = engine.es[eId].val;
        }
        return state;
    }
    function getContext() {
        return context;
    }
    function setContext(ctx) {
        context = ctx;
    }
    function getMeta() {
        return meta;
    }
    function setMeta(newMeta) {
        if (newMeta != null && typeof newMeta === "object" && !(newMeta instanceof Array)) {
            meta = Object.assign({}, meta, newMeta);
        }
    }
    function setDebug(isDebug) {
        debug = isDebug;
    }
    function get(id) {
        return engine.es[id] && engine.es[id].val;
    }
    function set(id, value) {
        var eE = engineE(id);
        if (!eE.accept || eE.accept(value, eE.val)) {
            eE.val = value;
            activatedEntities[id] = true;
            processGraph = true;
            flush();
        }
    }
    function update(id, fn) {
        set(id, fn(get(id)));
    }
    function on(id, cb) {
        var eE = engineE(id);
        eE.cb.push(cb);
    }
    function off(id, cb) {
        var eE = engineE(id);
        if (cb) {
            eE.cb = eE.cb.filter(function (c) { return c !== cb; });
        }
        else {
            eE.cb = [];
        }
    }
    function addEntity(spec) {
        var e = types.createEntity(spec);
        entities[e.id] = e;
        var eE = engineE(e.id);
        if (e.value != null && eE.val == null) {
            eE.val = e.value;
            activatedEntities[e.id] = false;
            processGraph = true;
        }
        eE.accept = e.accept;
        return e;
    }
    function removeEntity(id) {
        var eE = engineE(id);
        for (var aId in eE.arcs) {
            removeArc(aId);
        }
        delete engine.es[id];
        delete entities[id];
    }
    function addProcess(spec) {
        var p = types.createProcess(spec, context);
        processes[p.id] = p;
        var eP = engineP(p.id);
        delete eP.acc;
        eP.values = [];
        eP.sources = [];
        eP.async = p.async;
        Object.keys(eP.arcs).forEach(function (aId) {
            var port = arcs[aId].port;
            if (port != null &&
                (!p.ports[port] ||
                    p.ports[port] === types.PORT_TYPES.ACCUMULATOR)) {
                removeArc(aId);
            }
        });
        for (var portId in p.ports) {
            if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
                eP.acc = portId;
            }
        }
        for (var aId in eP.arcs) {
            updateArc(arcs[aId]);
        }
        return p;
    }
    function removeProcess(id) {
        var eP = engineP(id);
        if (eP.stop) {
            eP.stop();
            delete eP.stop;
        }
        for (var aId in eP.arcs) {
            removeArc(aId);
        }
        delete engine.ps[id];
        delete processes[id];
    }
    function addArc(spec) {
        var arc = types.createArc(spec);
        arcs[arc.id] = arc;
        updateArc(arc);
        var eP = engineP(arc.process), p = processes[arc.process];
        if (p && p.autostart === true &&
            Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
            autostart(eP);
        }
        return arc;
    }
    function removeArc(id) {
        var arc = arcs[id];
        if (arc) {
            var eP = engineP(arc.process), eE = engineE(arc.entity);
            delete eP.arcs[id];
            delete eE.arcs[id];
            if (arc.port != null) {
                delete eE.effects[arc.process];
                delete eP.sources[arc.port];
                delete eP.values[arc.port];
            }
            else {
                if (eP.stop) {
                    eP.stop();
                    delete eP.stop;
                }
                eP.sink = function () { };
                delete eP.out;
                delete eE.reactions[arc.process];
            }
        }
        delete arcs[id];
    }
    function updateArc(arc) {
        var pId = arc.process, eId = arc.entity, eP = engineP(pId), eE = engineE(eId), p = processes[pId];
        eE.arcs[arc.id] = true;
        if (p) {
            eP.arcs[arc.id] = true;
            if (arc.port != null) {
                delete eE.effects[pId];
                if (p.ports && p.ports[arc.port] != null) {
                    eP.sources[arc.port] = eE;
                    if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
                        eE.effects[pId] = eP;
                    }
                }
            }
            else {
                eP.out = eE;
                if (eP.acc != null) {
                    eP.sources[eP.acc] = eE;
                    eE.reactions[pId] = eP;
                }
                else {
                    delete eE.reactions[pId];
                }
                eP.sink = function (value) {
                    if (!eE.accept || eE.accept(value, eE.val)) {
                        eE.val = value;
                        if (value != null) {
                            activatedEntities[eE.id] = true;
                            processGraph = true;
                        }
                        if (!blockFlush) {
                            flush();
                        }
                    }
                };
            }
        }
    }
    function addGraph(graphSpec) {
        if (graphSpec.entities) {
            for (var i in graphSpec.entities) {
                addEntity(graphSpec.entities[i]);
            }
        }
        if (graphSpec.processes) {
            for (var i in graphSpec.processes) {
                addProcess(graphSpec.processes[i]);
            }
        }
        if (graphSpec.arcs) {
            for (var i in graphSpec.arcs) {
                addArc(graphSpec.arcs[i]);
            }
        }
        if (graphSpec.meta) {
            setMeta(graphSpec.meta);
        }
    }
    var callbacksWaiting = {};
    var activatedEntities = {};
    var blockFlush = false;
    var processGraph = false;
    function flush() {
        if (debug) {
            console.log("flushing graph recursively with", activatedEntities);
        }
        var activeEIds = Object.keys(activatedEntities);
        if (processGraph) {
            for (var i = 0; i < activeEIds.length; i++) {
                var eId = activeEIds[i];
                if (activatedEntities[eId]) {
                    var eE = engine.es[eId];
                    for (var p in eE.reactions) {
                        execute(eE.reactions[p]);
                    }
                }
            }
            var calledProcesses = {};
            activatedEntities = {};
            processGraph = false;
            blockFlush = true;
            for (var i = 0; i < activeEIds.length; i++) {
                var eId = activeEIds[i];
                var eE = engine.es[eId];
                if (eE.cb.length > 0) {
                    callbacksWaiting[eId] = eE;
                }
                for (var p in eE.effects) {
                    if (!calledProcesses[p]) {
                        execute(eE.effects[p]);
                        calledProcesses[p] = true;
                    }
                }
            }
            blockFlush = false;
            if (processGraph) {
                flush();
            }
            else {
                for (var eId in callbacksWaiting) {
                    var eE = callbacksWaiting[eId];
                    for (var i = 0; i < eE.cb.length; i++) {
                        eE.cb[i](eE.val);
                    }
                }
                callbacksWaiting = {};
                if (debug) {
                    console.log("flush finished");
                }
            }
        }
    }
    function execute(eP) {
        var complete = true;
        for (var portId = 0; portId < eP.sources.length; portId++) {
            var src = eP.sources[portId];
            if (src.val == null) {
                complete = false;
                break;
            }
            else {
                eP.values[portId] = src.val;
            }
        }
        if (complete) {
            if (debug) {
                console.log("running process", eP.id);
            }
            if (eP.async) {
                eP.stop && eP.stop();
                eP.stop = processes[eP.id].procedure.apply(context, [eP.sink].concat(eP.values));
            }
            else {
                var val = processes[eP.id].procedure.apply(context, eP.values);
                if (eP.out) {
                    var out = eP.out;
                    if (!out.accept || out.accept(val, out.val)) {
                        out.val = val;
                        if (val != null) {
                            activatedEntities[eP.out.id] = eP.acc == null;
                            processGraph = true;
                        }
                    }
                }
            }
        }
    }
    function autostart(eP) {
        if (eP.async) {
            setTimeout(function () {
                execute(eP);
            }, 10);
        }
        else {
            execute(eP);
            if (eP.out) {
                activatedEntities[eP.out.id] = false;
                processGraph = true;
            }
        }
    }
    function start(processId) {
        var eP = engineP(processId);
        execute(eP);
        if (!eP.async) {
            flush();
        }
    }
    function stop(processId) {
        var eP = engineP(processId);
        if (eP.stop) {
            eP.stop();
            delete eP.stop;
        }
    }
    function engineE(id) {
        if (!entities[id]) {
            addEntity({ id: id });
        }
        return engine.es[id] || (engine.es[id] = {
            id: id,
            val: undefined,
            reactions: {},
            effects: {},
            arcs: {},
            cb: []
        });
    }
    function engineP(id) {
        return engine.ps[id] || (engine.ps[id] = {
            id: id,
            arcs: {},
            sink: function () { }
        });
    }
    return {
        addEntity: addEntity,
        removeEntity: removeEntity,
        addProcess: addProcess,
        removeProcess: removeProcess,
        addArc: addArc,
        removeArc: removeArc,
        addGraph: addGraph,
        getGraph: getGraph,
        getState: getState,
        setMeta: setMeta,
        getMeta: getMeta,
        getContext: getContext,
        setContext: setContext,
        setDebug: setDebug,
        get: get,
        set: set,
        update: update,
        on: on,
        off: off,
        start: start,
        stop: stop,
        flush: flush,
        PORT_TYPES: __assign({}, types.PORT_TYPES)
    };
}
//# sourceMappingURL=runtime.js.map