import * as types from './runtime-types';
export function create() {
    var entities = {}, processes = {}, arcs = {}, meta = {}, context = null, engine = {
        es: {},
        ps: {},
    }, debug = false;
    function getGraph() {
        return { entities, processes, arcs, meta };
    }
    function getState() {
        let state = {};
        for (let eId in engine.es) {
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
        let eE = engineE(id);
        eE.val = value;
        activatedEntities[id] = true;
        processGraph = true;
        flush();
    }
    function update(id, fn) {
        set(id, fn(get(id)));
    }
    function on(id, cb) {
        let eE = engineE(id);
        eE.cb = cb;
    }
    function off(id) {
        let eE = engineE(id);
        delete eE.cb;
    }
    function addEntity(spec) {
        let e = types.createEntity(spec);
        entities[e.id] = e;
        let eE = engineE(e.id);
        if (e.value != null && eE.val == null) {
            eE.val = e.value;
            activatedEntities[e.id] = false;
            processGraph = true;
        }
        if (e.json != null && eE.val == null) {
            eE.val = JSON.parse(e.json);
            activatedEntities[e.id] = false;
            processGraph = true;
        }
        return e;
    }
    function removeEntity(id) {
        let eE = engineE(id);
        for (let aId in eE.arcs) {
            removeArc(aId);
        }
        delete engine.es[id];
        delete entities[id];
    }
    function addProcess(spec) {
        let p = types.createProcess(spec, context);
        processes[p.id] = p;
        let eP = engineP(p.id);
        delete eP.acc;
        eP.values = [];
        eP.sources = [];
        eP.async = p.async;
        Object.keys(eP.arcs).forEach(aId => {
            let port = arcs[aId].port;
            if (port != null &&
                (!p.ports[port] ||
                    p.ports[port] === types.PORT_TYPES.ACCUMULATOR)) {
                removeArc(aId);
            }
        });
        for (let portId in p.ports) {
            if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
                eP.acc = portId;
            }
        }
        for (let aId in eP.arcs) {
            updateArc(arcs[aId]);
        }
        return p;
    }
    function removeProcess(id) {
        let eP = engineP(id);
        if (eP.stop) {
            eP.stop();
            delete eP.stop;
        }
        for (let aId in eP.arcs) {
            removeArc(aId);
        }
        delete engine.ps[id];
        delete processes[id];
    }
    function addArc(spec) {
        let arc = types.createArc(spec);
        arcs[arc.id] = arc;
        updateArc(arc);
        let eP = engineP(arc.process), p = processes[arc.process];
        if (p && p.autostart === true &&
            Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
            autostart(eP);
        }
        return arc;
    }
    function removeArc(id) {
        let arc = arcs[id];
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
        let pId = arc.process, eId = arc.entity, eP = engineP(pId), eE = engineE(eId), p = processes[pId];
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
                eP.sink = value => {
                    eE.val = value;
                    if (value != null) {
                        activatedEntities[eE.id] = true;
                        processGraph = true;
                    }
                    if (!blockFlush) {
                        flush();
                    }
                };
                eP.out = eE;
                if (eP.acc != null) {
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
            for (let i in graphSpec.entities) {
                addEntity(graphSpec.entities[i]);
            }
        }
        if (graphSpec.processes) {
            for (let i in graphSpec.processes) {
                addProcess(graphSpec.processes[i]);
            }
        }
        if (graphSpec.arcs) {
            for (let i in graphSpec.arcs) {
                addArc(graphSpec.arcs[i]);
            }
        }
        if (graphSpec.meta) {
            setMeta(graphSpec.meta);
        }
    }
    let callbacksWaiting = {};
    let activatedEntities = {};
    let blockFlush = false;
    let processGraph = false;
    function flush() {
        if (debug) {
            console.log("flushing graph recursively with", activatedEntities);
        }
        let activeEIds = Object.keys(activatedEntities);
        if (processGraph) {
            for (let i = 0; i < activeEIds.length; i++) {
                let eId = activeEIds[i];
                if (activatedEntities[eId]) {
                    let eE = engine.es[eId];
                    for (let p in eE.reactions) {
                        execute(eE.reactions[p]);
                    }
                }
            }
            let calledProcesses = {};
            activatedEntities = {};
            processGraph = false;
            blockFlush = true;
            for (let i = 0; i < activeEIds.length; i++) {
                let eId = activeEIds[i];
                let eE = engine.es[eId];
                if (eE.cb) {
                    callbacksWaiting[eId] = eE;
                }
                for (let p in eE.effects) {
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
                for (let eId in callbacksWaiting) {
                    let eE = callbacksWaiting[eId];
                    eE.cb(eE.val);
                }
                callbacksWaiting = {};
                if (debug) {
                    console.log("flush finished");
                }
            }
        }
    }
    function execute(eP) {
        let complete = true;
        for (let portId = 0; portId < eP.sources.length; portId++) {
            let src = eP.sources[portId];
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
                let val = processes[eP.id].procedure.apply(context, eP.values);
                if (eP.out) {
                    eP.out.val = val;
                    if (val != null) {
                        activatedEntities[eP.out.id] = eP.acc == null;
                        processGraph = true;
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
        let eP = engineP(processId);
        execute(eP);
        if (!eP.async) {
            flush();
        }
    }
    function stop(processId) {
        let eP = engineP(processId);
        if (eP.stop) {
            eP.stop();
            delete eP.stop;
        }
    }
    function engineE(id) {
        if (!entities[id]) {
            addEntity({ id });
        }
        return engine.es[id] || (engine.es[id] = {
            id,
            val: undefined,
            reactions: {},
            effects: {},
            arcs: {}
        });
    }
    function engineP(id) {
        return engine.ps[id] || (engine.ps[id] = {
            id,
            arcs: {},
            sink: () => { }
        });
    }
    return {
        addEntity,
        removeEntity,
        addProcess,
        removeProcess,
        addArc,
        removeArc,
        addGraph,
        getGraph,
        getState,
        setMeta,
        getMeta,
        getContext,
        setContext,
        setDebug,
        get: get,
        set: set,
        update,
        on,
        off,
        start,
        stop,
        flush,
        PORT_TYPES: Object.assign({}, types.PORT_TYPES)
    };
}
//# sourceMappingURL=runtime.js.map