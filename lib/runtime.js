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
        eE.val = value;
        touchEntity(eE);
        flush();
    }
    function update(id, fn) {
        set(id, fn(get(id)));
    }
    function on(id, cb) {
        var eE = engineE(id);
        eE.cb = cb;
    }
    function off(id) {
        var eE = engineE(id);
        delete eE.cb;
    }
    function addEntity(spec) {
        var e = types.createEntity(spec);
        entities[e.id] = e;
        var eE = engineE(e.id);
        eE.event = e.isEvent;
        if (e.value != null && eE.val == null) {
            eE.val = e.value;
            touchEntity(eE);
        }
        if (e.json != null && eE.val == null) {
            eE.val = JSON.parse(e.json);
            touchEntity(eE);
        }
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
        eP.acc = null;
        eP.async = p.async;
        var portNames = Object.keys(p.ports);
        for (var aId in eP.arcs) {
            var port = arcs[aId].port;
            if (port &&
                (portNames.indexOf(port) < 0 ||
                    p.ports[port] === types.PORT_TYPES.ACCUMULATOR)) {
                removeArc(aId);
            }
        }
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
        eP.stop && eP.stop();
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
            if (arc.port) {
                delete eE.effects[arc.process];
                delete eP.sources[arc.port];
                delete eP.values[arc.port];
            }
            else {
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
            if (arc.port) {
                eP.sources[arc.port] = eE;
                if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
                    eE.effects[pId] = eP;
                }
                else {
                    delete eE.effects[pId];
                }
            }
            else {
                eP.sink = function (value) {
                    eE.val = value;
                    touchEntity(eE);
                    if (!blockFlush) {
                        flush();
                    }
                    else {
                        continueFlush = true;
                    }
                };
                eP.out = eE;
                if (eP.acc) {
                    eP.sources[eP.acc] = eE;
                    eE.reactions[pId] = eP;
                }
                else {
                    delete eE.reactions[pId];
                }
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
        flush();
    }
    var touchedEntities = {};
    function touchEntity(eE, eP) {
        touchedEntities[eE.id] = eP || true;
    }
    var order = [], callbacks = {}, syncSchedule = {}, asyncSchedule = {}, activeEntities = {}, blockFlush = false, continueFlush = false;
    function getSchedule(eE, level, pLast) {
        if (level === void 0) { level = 0; }
        activeEntities[eE.id] = true;
        if (eE.cb) {
            callbacks[eE.id] = eE;
        }
        if (!pLast || !pLast.acc) {
            var inc = false;
            for (var pId in eE.reactions) {
                inc = true;
                if (!syncSchedule[pId]) {
                    syncSchedule[pId] = { level: level, eP: eE.reactions[pId] };
                }
                else if (syncSchedule[pId].level < level) {
                    syncSchedule[pId].level = level;
                }
            }
            if (inc)
                level++;
        }
        for (var pId in eE.effects) {
            var eP = eE.effects[pId];
            if (eP.async) {
                asyncSchedule[pId] = eP;
            }
            else {
                if (eP.acc && eP.out && eP.out.val == null) {
                    continue;
                }
                if (!syncSchedule[pId]) {
                    syncSchedule[pId] = { level: level, eP: eP };
                }
                else if (syncSchedule[pId].level < level) {
                    syncSchedule[pId].level = level;
                }
                if (eP.out) {
                    getSchedule(eP.out, level + 1, eP);
                }
            }
        }
    }
    function flush() {
        if (debug) {
            console.log("flushing graph with", touchedEntities);
        }
        activeEntities = {};
        syncSchedule = {};
        asyncSchedule = {};
        callbacks = {};
        for (var eId in touchedEntities) {
            getSchedule(engine.es[eId], 0, touchedEntities[eId]);
        }
        touchedEntities = {};
        for (var eId in syncSchedule) {
            var step = syncSchedule[eId];
            if (order[step.level]) {
                order[step.level].push(step.eP);
            }
            else {
                order[step.level] = [step.eP];
            }
        }
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < order[i].length; j++) {
                execute(order[i][j], activeEntities);
            }
        }
        order.length = 0;
        for (var eId in callbacks) {
            callbacks[eId].cb(callbacks[eId].val);
        }
        blockFlush = true;
        continueFlush = false;
        for (var pId in asyncSchedule) {
            execute(asyncSchedule[pId], activeEntities);
        }
        blockFlush = false;
        continueFlush && flush();
    }
    function execute(eP, activeEntities) {
        if (debug) {
            console.log("executing process", eP.id);
        }
        for (var portId in eP.sources) {
            var src = eP.sources[portId];
            if (src.event && !(activeEntities && activeEntities[src.id])) {
                eP.values[portId] = undefined;
            }
            else {
                eP.values[portId] = src.val;
            }
        }
        if (eP.async) {
            eP.stop && eP.stop();
            eP.stop = processes[eP.id].procedure.call(context, eP.values, eP.sink);
        }
        else {
            var val = processes[eP.id].procedure.call(context, eP.values);
            if (eP.out)
                eP.out.val = val;
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
            touchEntity(eP.out);
        }
    }
    function start(processId) {
        var eP = engineP(processId);
        execute(eP);
        if (eP.out && !eP.async) {
            touchEntity(eP.out, eP);
            flush();
        }
    }
    function stop(processId) {
        var eP = engineP(processId);
        eP.stop && eP.stop();
        delete eP.stop;
    }
    function engineE(id) {
        if (!entities[id]) {
            addEntity({ id: id });
        }
        return engine.es[id] || (engine.es[id] = {
            id: id,
            reactions: {},
            effects: {},
            arcs: {}
        });
    }
    function engineP(id) {
        return engine.ps[id] || (engine.ps[id] = {
            id: id,
            acc: null,
            sources: {},
            arcs: {},
            values: {},
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
        PORT_TYPES: Object.assign({}, types.PORT_TYPES)
    };
}
//# sourceMappingURL=runtime.js.map