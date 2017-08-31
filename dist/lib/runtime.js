var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { createEntity, createProcess, PORT_TYPES, createArc } from './runtime-types';
export function create() {
    var entities = {};
    var processes = {};
    var arcs = {};
    var engine = {
        es: {},
        ps: {}
    };
    var meta = {};
    var context = null;
    var debug = false;
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
        if (newMeta != null && typeof newMeta === 'object' && !(newMeta instanceof Array)) {
            meta = __assign({}, meta, newMeta);
        }
    }
    function setDebug(isDebug) {
        debug = isDebug;
    }
    function get(id) {
        return engine.es[id] && engine.es[id].val;
    }
    function set(id, value) {
        if (setVal(engineE(id), value, true)) {
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
        var e = createEntity(spec);
        entities[e.id] = e;
        var eE = engineE(e.id);
        if (e.value != null && (e.reset || eE.val == null)) {
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
        var p = createProcess(spec, context);
        var ports = p.ports;
        var eP = engineP(p.id);
        processes[p.id] = p;
        delete eP.acc;
        eP.values = [];
        eP.sources = [];
        eP.async = p.async;
        eP.delta = p.delta;
        Object.keys(eP.arcs).forEach(function (aId) {
            var port = arcs[aId].port;
            if (port != null &&
                (!ports[port] || ports[port] === PORT_TYPES.ACCUMULATOR)) {
                removeArc(aId);
            }
        });
        ports.forEach(function (port, i) {
            if (port === PORT_TYPES.ACCUMULATOR) {
                eP.acc = i;
            }
        });
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
        var arc = createArc(spec);
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
                    if (p.ports[arc.port] === PORT_TYPES.HOT) {
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
                    if (setVal(eE, value, true) && !blockFlush) {
                        flush();
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
        setMeta(graphSpec.meta);
    }
    function replaceGraph(graphSpec) {
        var newEntityIds = {};
        var newProcessIds = {};
        if (graphSpec.entities) {
            for (var i in graphSpec.entities) {
                var e = graphSpec.entities[i];
                if (e.id) {
                    newEntityIds[e.id] = true;
                }
            }
        }
        if (graphSpec.processes) {
            for (var i in graphSpec.processes) {
                var p = graphSpec.processes[i];
                if (p.id) {
                    newProcessIds[p.id] = true;
                }
            }
        }
        Object.keys(entities)
            .filter(function (id) { return !newEntityIds[id]; })
            .forEach(removeEntity);
        Object.keys(processes)
            .filter(function (id) { return !newProcessIds[id]; })
            .forEach(removeProcess);
        addGraph(graphSpec);
    }
    var callbacksWaiting = {};
    var activatedEntities = {};
    var blockFlush = false;
    var processGraph = false;
    function flush() {
        if (debug) {
            console.log('flushing graph recursively with', activatedEntities);
        }
        var activeEIds = Object.keys(activatedEntities);
        for (var _i = 0, activeEIds_1 = activeEIds; _i < activeEIds_1.length; _i++) {
            var eId = activeEIds_1[_i];
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
        for (var _a = 0, activeEIds_2 = activeEIds; _a < activeEIds_2.length; _a++) {
            var eId = activeEIds_2[_a];
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
            var cbs = Object.keys(callbacksWaiting);
            callbacksWaiting = {};
            for (var i in cbs) {
                var eE = engine.es[cbs[i]];
                for (var _b = 0, _c = eE.cb; _b < _c.length; _b++) {
                    var cb = _c[_b];
                    cb(eE.val);
                }
            }
            if (debug) {
                console.log('flush finished');
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
                if (eP.delta) {
                    if (src.oldVal == null) {
                        complete = false;
                        break;
                    }
                    else {
                        eP.values[portId + 1] = src.oldVal;
                    }
                }
            }
        }
        if (complete) {
            if (debug) {
                console.log('running process', eP.id);
            }
            if (eP.async) {
                if (eP.stop) {
                    eP.stop();
                }
                eP.stop = processes[eP.id].procedure.apply(context, [eP.sink].concat(eP.values));
            }
            else {
                var val = processes[eP.id].procedure.apply(context, eP.values);
                if (eP.out) {
                    setVal(eP.out, val, eP.acc == null);
                }
            }
        }
    }
    function setVal(eE, val, runReactions) {
        if (!eE.accept || eE.accept(val, eE.val)) {
            eE.oldVal = eE.val;
            eE.val = val;
            if (val != null) {
                activatedEntities[eE.id] = runReactions;
                processGraph = true;
            }
            return true;
        }
        return false;
    }
    function autostart(eP) {
        if (eP.async) {
            requestAnimationFrame(function () {
                execute(eP);
            });
        }
        else {
            execute(eP);
            if (eP.out) {
                activatedEntities[eP.out.id] = false;
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
        replaceGraph: replaceGraph,
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
        PORT_TYPES: __assign({}, PORT_TYPES)
    };
}
//# sourceMappingURL=runtime.js.map