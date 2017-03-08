import * as types from './runtime-types'

interface EngineEntity {
  id: string
  val?: any
  reactions: {[id: string]: EngineProcess}
  effects: {[id: string]: EngineProcess}
  arcs: {[id: string]: true}
  cb: ((val?: any) => void)[]
  accept?: types.AcceptPredicate
}

interface EngineProcess {
  id: string
  out?: EngineEntity
  acc?: string
  async?: boolean
  sources: EngineEntity[]
  values: any[]
  sink: (val?: any) => void
  stop?: () => void
  arcs: {[id: string]: true}
}

interface Engine {
  es: {[id: string]: EngineEntity}
  ps: {[id: string]: EngineProcess}
}


export function create(): types.Runtime {

  var entities = {},
      processes = {},
      arcs = {},
      meta = {},
      context = null,
      engine: Engine = {
        es: {},
        ps: {},
      },
      debug = false


  function getGraph() {
    return { entities, processes, arcs, meta }
  }


  function getState() {
    let state = {}
    for (let eId in engine.es) {
      state[eId] = engine.es[eId].val
    }
    return state
  }


  function getContext() {
    return context
  }


  function setContext(ctx) {
    context = ctx;
  }


  function getMeta() {
    return meta;
  }


  function setMeta(newMeta) {
    if (newMeta != null && typeof newMeta === "object" && !(newMeta instanceof Array)) {
      meta = Object.assign({}, meta, newMeta)
    }
  }


  function setDebug(isDebug: boolean) {
    debug = isDebug
  }


  // ===== entity operations =====

  function get (id: string): any {
    return engine.es[id] && engine.es[id].val
  }


  function set (id: string, value: any) {
    let eE = engineE(id)
    if (!eE.accept || eE.accept(value, eE.val)) {
      eE.val = value
      activatedEntities[id] = true
      processGraph = true
      flush()
    }
  }


  function update (id: string, fn: (val: any) => any) {
    set(id, fn(get(id)))
  }


  function on (id: string, cb: (val: any) => void) {
    let eE = engineE(id)
    eE.cb.push(cb)
  }


  function off (id: string, cb?: (val: any) => void) {
    let eE = engineE(id)
    if (cb) {
      eE.cb = eE.cb.filter(c => c !== cb)
    } else {
      eE.cb = []
    }
  }


  // ===== update flow topology =====

  function addEntity(spec: types.EntityData): types.Entity {
    let e = types.createEntity(spec)
    entities[e.id] = e

    let eE = engineE(e.id)

    if (e.value != null && eE.val == null) {
      eE.val = e.value
      activatedEntities[e.id] = false
      processGraph = true
    }

    eE.accept = e.accept

    return e
  }


  function removeEntity(id: string) {
    let eE = engineE(id)
    for (let aId in eE.arcs) {
      removeArc(aId)
    }
    delete engine.es[id]
    delete entities[id]
  }


  function addProcess(spec: types.ProcessData): types.Process {
    let p = types.createProcess(spec, context)
    processes[p.id] = p
    let eP = engineP(p.id)

    delete eP.acc
    eP.values = []
    eP.sources = []
    eP.async = p.async

    // cleanup unused arcs
    Object.keys(eP.arcs).forEach(aId => {
      let port = arcs[aId].port
      if (port != null &&
          (!p.ports[port] ||
            p.ports[port] === types.PORT_TYPES.ACCUMULATOR)) {
        removeArc(aId)
      }
    })

    // set accumulator if present
    for (let portId in p.ports) {
      if (p.ports[portId] === types.PORT_TYPES.ACCUMULATOR) {
        eP.acc = portId
      }
    }

    // readjust already present arc
    for(let aId in eP.arcs) {
      updateArc(arcs[aId])
    }

    return p
  }


  function removeProcess(id: string) {
    let eP = engineP(id)
    if (eP.stop) {
      eP.stop()
      delete eP.stop
    }
    for (let aId in eP.arcs) {
      removeArc(aId)
    }
    delete engine.ps[id]
    delete processes[id]
  }


  function addArc(spec: types.ArcData): types.Arc {
    let arc = types.createArc(spec)
    arcs[arc.id] = arc
    updateArc(arc)

    // autostart
    let eP = engineP(arc.process),
        p = processes[arc.process]
    if (p && p.autostart === true &&
        Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
      autostart(eP)
    }

    return arc
  }


  function removeArc(id: string) {
    let arc = arcs[id]

    if (arc) {
      var eP = engineP(arc.process),
          eE = engineE(arc.entity)

      delete eP.arcs[id]
      delete eE.arcs[id]

      if (arc.port != null) {
        delete eE.effects[arc.process]
        delete eP.sources[arc.port]
        delete eP.values[arc.port]
      } else {
        if (eP.stop) {
          eP.stop()
          delete eP.stop
        }
        eP.sink = function() {}
        delete eP.out
        delete eE.reactions[arc.process]
      }
    }
    delete arcs[id]
  }


  function updateArc(arc: types.Arc) {
    let pId = arc.process,
        eId = arc.entity,
        eP = engineP(pId),
        eE = engineE(eId),
        p = processes[pId]

    eE.arcs[arc.id] = true

    if (p) {

      eP.arcs[arc.id] = true

      // from entity to process
      if (arc.port != null) {
        delete eE.effects[pId]
        if (p.ports && p.ports[arc.port] != null) {
          eP.sources[arc.port] = eE
          if (p.ports[arc.port] == types.PORT_TYPES.HOT) {
            eE.effects[pId] = eP
          }
        }

      // from process to entity
      } else {
        eP.out = eE

        if (eP.acc != null) {
          eP.sources[eP.acc] = eE
          eE.reactions[pId] = eP
        } else {
          delete eE.reactions[pId]
        }

        eP.sink = value => {
          if (!eE.accept || eE.accept(value, eE.val)) {
            eE.val = value
            if (value != null) {
              activatedEntities[eE.id] = true
              processGraph = true
            }
            if (!blockFlush) {
              flush()
            }
          }
        }

      }
    }
  }


  function addGraph(graphSpec: types.Graph) {
    if (graphSpec.entities) {
      for (let i in graphSpec.entities) {
        addEntity(graphSpec.entities[i])
      }
    }
    if (graphSpec.processes) {
      for (let i in graphSpec.processes) {
        addProcess(graphSpec.processes[i])
      }
    }
    if (graphSpec.arcs) {
      for (let i in graphSpec.arcs) {
        addArc(graphSpec.arcs[i])
      }
    }
    if (graphSpec.meta) {
      setMeta(graphSpec.meta)
    }
  }


  // ===== flow execution =====

  let callbacksWaiting = {}
  let activatedEntities = {}

  let blockFlush = false
  let processGraph = false

  function flush() {
    if(debug) {
      console.log("flushing graph recursively with", activatedEntities)
    }

    let activeEIds = Object.keys(activatedEntities)

    // still stuff to do
    if (processGraph) {

      // update reactive state
      for (let i = 0; i < activeEIds.length; i++) {
        let eId = activeEIds[i]
        if (activatedEntities[eId]) {
          let eE = engine.es[eId]
          for (let p in eE.reactions) {
            execute(eE.reactions[p])
          }
        }
      }

      let calledProcesses = {}
      activatedEntities = {}
      processGraph = false

      blockFlush = true
      for (let i = 0; i < activeEIds.length; i++) {
        let eId = activeEIds[i]
        let eE = engine.es[eId]
        if (eE.cb.length > 0) {
          callbacksWaiting[eId] = eE
        }
        for (let p in eE.effects) {
          if(!calledProcesses[p]) {
            execute(eE.effects[p])
            calledProcesses[p] = true
          }
        }
      }
      blockFlush = false

      if (processGraph) {
        flush()

      // cleanup
      } else {

        // callbacks
        for (let eId in callbacksWaiting) {
          let eE = callbacksWaiting[eId];
          for (let i = 0; i < eE.cb.length; i++) {
            eE.cb[i](eE.val)
          }
        }

        callbacksWaiting = {}

        if(debug) {
          console.log("flush finished")
        }
      }
    }
  }


  function execute(eP: EngineProcess) {
    let complete = true
    for (let portId = 0; portId < eP.sources.length; portId++) {
      let src = eP.sources[portId]
      if (src.val == null) {
        complete = false
        break
      } else {
        eP.values[portId] = src.val
      }
    }

    if (complete) {
      if(debug) {
        console.log("running process", eP.id)
      }

      if (eP.async) {
        eP.stop && eP.stop()
        // TODO check for optimization to avoid array generation and concat call...
        eP.stop = processes[eP.id].procedure.apply(context, [eP.sink].concat(eP.values))
      } else {
        let val = processes[eP.id].procedure.apply(context, eP.values)
        if (eP.out) {
          let out = eP.out
          if (!out.accept || out.accept(val, out.val)) {
            out.val = val
            if (val != null) {
              activatedEntities[eP.out.id] = eP.acc == null
              processGraph = true
            }
          }
        }
      }
    }
  }


  function autostart(eP: EngineProcess) {
    if (eP.async) {
      setTimeout(function() {
        execute(eP)
      }, 10)
    } else {
      execute(eP)
      if (eP.out) {
        activatedEntities[eP.out.id] = false
        processGraph = true
      }
    }
  }


  function start(processId: string) {
    let eP = engineP(processId)
    execute(eP)
    if (!eP.async) {
      flush()
    }
  }


  function stop(processId: string) {
    let eP = engineP(processId)
    if (eP.stop) {
      eP.stop()
      delete eP.stop
    }
  }


  // ===== helpers =====

  function engineE(id: string) {
    if (!entities[id]) {
      addEntity({id})
    }
    return engine.es[id] || (engine.es[id] = {
      id,
      val: undefined,
      reactions: {},
      effects: {},
      arcs: {},
      cb: []
    } as EngineEntity)
  }


  function engineP(id: string) {
    return engine.ps[id] || (engine.ps[id] = {
      id,
      arcs: {},
      sink: () => {}
    } as EngineProcess)
  }


  // ===== runtime api =====

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

    PORT_TYPES: {...types.PORT_TYPES}
  }
}
