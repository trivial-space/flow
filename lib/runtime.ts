import { AcceptPredicate, Runtime, Entity, Process, Arc, Meta, EntityData, createEntity, ProcessData, createProcess, PORT_TYPES, ArcData, createArc, PortType, GraphData } from './runtime-types'


interface EngineEntity {
	id: string
	val?: any,
	oldVal?: any
	reactions: { [id: string]: EngineProcess }
	effects: { [id: string]: EngineProcess }
	arcs: { [id: string]: true }
	cb: ((val?: any) => void)[]
	accept?: AcceptPredicate<any>
}

interface EngineProcess {
	id: string
	out?: EngineEntity
	acc?: number
	async?: boolean
	delta?: boolean
	sources: EngineEntity[]
	values: any[]
	sink: (val?: any) => void
	stop?: () => void
	arcs: { [id: string]: true }
}

interface Engine {
	es: { [id: string]: EngineEntity }
	ps: { [id: string]: EngineProcess }
}


export function create (): Runtime {

	const entities: { [id: string]: Entity } = {}
	const processes: { [id: string]: Process } = {}
	const arcs: { [id: string]: Arc } = {}
	const engine: Engine = {
		es: {},
		ps: {}
	}
	let meta: Meta = {}
	let context: any = null
	let debug = false


	function getGraph () {
		return { entities, processes, arcs, meta }
	}


	function getState () {
		const state: { [id: string]: any } = {}
		for (const eId in engine.es) {
			state[eId] = engine.es[eId].val
		}
		return state
	}


	function getContext () {
		return context
	}


	function setContext (ctx: any) {
		context = ctx
	}


	function getMeta () {
		return meta
	}


	function setMeta (newMeta: any) {
		if (newMeta != null && typeof newMeta === 'object' && !(newMeta instanceof Array)) {
			meta = { ...meta, ...newMeta }
		}
	}


	function setDebug (isDebug: boolean) {
		debug = isDebug
	}


	// ===== entity operations =====

	function get (id: string): any {
		return engine.es[id] && engine.es[id].val
	}


	function set (id: string, value: any) {
		if (setVal(engineE(id), value, true)) {
			flush()
		}
	}


	function update (id: string, fn: (val: any) => any) {
		set(id, fn(get(id)))
	}


	function on (id: string, cb: (val: any) => void) {
		const eE = engineE(id)
		eE.cb.push(cb)
	}


	function off (id: string, cb?: (val: any) => void) {
		const eE = engineE(id)
		if (cb) {
			eE.cb = eE.cb.filter(c => c !== cb)
		} else {
			eE.cb = []
		}
	}


	// ===== update flow topology =====

	function addEntity (spec: EntityData): Entity {
		const e = createEntity(spec)
		entities[e.id] = e

		const eE = engineE(e.id)

		if (e.value != null && (e.reset || eE.val == null)) {
			eE.val = e.value
			activatedEntities[e.id] = false
			processGraph = true
		}

		eE.accept = e.accept

		return e
	}


	function removeEntity (id: string) {
		const eE = engineE(id)
		for (const aId in eE.arcs) {
			removeArc(aId)
		}
		delete engine.es[id]
		delete entities[id]
	}


	function addProcess (spec: ProcessData): Process {
		const p = createProcess(spec, context)
		const ports: PortType[] = p.ports
		const eP = engineP(p.id)

		processes[p.id] = p

		delete eP.acc
		eP.values = []
		eP.sources = []
		eP.async = p.async
		eP.delta = p.delta

		// cleanup unused arcs
		Object.keys(eP.arcs).forEach(aId => {
			const port = arcs[aId].port
			if (port != null &&
				(!ports[port] || ports[port] === PORT_TYPES.ACCUMULATOR)) {
				removeArc(aId)
			}
		})

		// set accumulator if present
		ports.forEach((port, i) => {
			if (port === PORT_TYPES.ACCUMULATOR) {
				eP.acc = i
			}
		})

		// readjust already present arc
		for (const aId in eP.arcs) {
			updateArc(arcs[aId])
		}

		return p
	}


	function removeProcess (id: string) {
		const eP = engineP(id)
		if (eP.stop) {
			eP.stop()
			delete eP.stop
		}
		for (const aId in eP.arcs) {
			removeArc(aId)
		}
		delete engine.ps[id]
		delete processes[id]
	}


	function addArc (spec: ArcData): Arc {
		const arc = createArc(spec)
		arcs[arc.id] = arc
		updateArc(arc)

		// autostart
		const eP = engineP(arc.process),
			p = processes[arc.process]
		if (p && p.autostart === true &&
			Object.keys(eP.arcs).length === Object.keys(p.ports).length + 1) {
			autostart(eP)
		}

		return arc
	}


	function removeArc (id: string) {
		const arc = arcs[id]

		if (arc) {
			const eP = engineP(arc.process),
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
				eP.sink = function() { }
				delete eP.out
				delete eE.reactions[arc.process]
			}
		}
		delete arcs[id]
	}


	function updateArc (arc: Arc) {
		const pId = arc.process,
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
					if (p.ports[arc.port] === PORT_TYPES.HOT) {
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
					if (setVal(eE, value, true) && !blockFlush) {
						flush()
					}
				}

			}
		}
	}


	function addGraph (graphSpec: GraphData) {
		if (graphSpec.entities) {
			for (const i in graphSpec.entities) {
				addEntity((graphSpec.entities as any)[i])
			}
		}
		if (graphSpec.processes) {
			for (const i in graphSpec.processes) {
				addProcess((graphSpec.processes as any)[i])
			}
		}
		if (graphSpec.arcs) {
			for (const i in graphSpec.arcs) {
				addArc((graphSpec.arcs as any)[i])
			}
		}
		setMeta(graphSpec.meta)
	}


	function replaceGraph (graphSpec: GraphData) {

		const newEntityIds: {[id: string]: true} = {}
		const newProcessIds: {[id: string]: true} = {}

		if (graphSpec.entities) {
			for (const i in graphSpec.entities) {
				const e: EntityData = (graphSpec.entities as any)[i]
				if (e.id) {
					newEntityIds[e.id] = true
				}
			}
		}

		if (graphSpec.processes) {
			for (const i in graphSpec.processes) {
				const p: ProcessData = (graphSpec.processes as any)[i]
				if (p.id) {
					newProcessIds[p.id] = true
				}
			}
		}

		const entitiesToRemove = Object.keys(entities)
			.filter(id => !newEntityIds[id])

		const processesToRemove = Object.keys(processes)
			.filter(id => !newProcessIds[id])

		entitiesToRemove.forEach(removeEntity)
		processesToRemove.forEach(removeProcess)

		addGraph(graphSpec)
	}


	// ===== flow execution =====

	let callbacksWaiting: { [id: string]: EngineEntity } = {}
	let activatedEntities: { [id: string]: boolean } = {}

	let blockFlush = false
	let processGraph = false


	function flush () {
		if (debug) {
			console.log('flushing graph recursively with', activatedEntities)
		}

		const activeEIds = Object.keys(activatedEntities)

		// update reactive state
		for (const eId of activeEIds) {
			if (activatedEntities[eId]) {
				const eE = engine.es[eId]
				for (const p in eE.reactions) {
					execute(eE.reactions[p])
				}
			}
		}

		const calledProcesses: { [id: string]: boolean } = {}
		activatedEntities = {}
		processGraph = false

		blockFlush = true
		for (const eId of activeEIds) {

			const eE = engine.es[eId]
			if (eE.cb.length > 0) {
				callbacksWaiting[eId] = eE
			}
			for (const p in eE.effects) {
				if (!calledProcesses[p]) {
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
			const cbs = Object.keys(callbacksWaiting)
			callbacksWaiting = {}

			for (const i in cbs) {
				const eE = engine.es[cbs[i]]
				for (const cb of eE.cb) {
					cb(eE.val)
				}
			}

			if (debug) {
				console.log('flush finished')
			}
		}
	}


	function execute (eP: EngineProcess) {
		let complete = true
		for (let portId = 0; portId < eP.sources.length; portId++) {
			const src = eP.sources[portId]
			if (src.val == null) {
				complete = false
				break
			} else {
				eP.values[portId] = src.val
				if (eP.delta) {
					if (src.oldVal == null) {
						complete = false
						break
					} else {
						eP.values[portId + 1] = src.oldVal
					}
				}
			}
		}

		if (complete) {
			if (debug) {
				console.log('running process', eP.id)
			}

			if (eP.async) {
				if (eP.stop) { eP.stop() }
				// TODO check for optimization to avoid array generation and concat call...
				eP.stop = processes[eP.id].procedure.apply(context, [eP.sink].concat(eP.values))
			} else {
				const val = processes[eP.id].procedure.apply(context, eP.values)
				if (eP.out) {
					setVal(eP.out, val, eP.acc == null)
				}
			}
		}
	}


	function setVal(eE: EngineEntity, val: any, runReactions: boolean) {
		if (!eE.accept || eE.accept(val, eE.val)) {
			eE.oldVal = eE.val
			eE.val = val
			if (val != null) {
				activatedEntities[eE.id] = runReactions
				processGraph = true
			}
			return true
		}
		return false
	}


	function autostart (eP: EngineProcess) {
		if (eP.async) {
			requestAnimationFrame(function() {
				execute(eP)
			})
		} else {
			execute(eP)
			if (eP.out) {
				activatedEntities[eP.out.id] = false
			}
		}
	}


	function start (processId: string) {
		const eP = engineP(processId)
		execute(eP)
		if (!eP.async) {
			flush()
		}
	}


	function stop (processId: string) {
		const eP = engineP(processId)
		if (eP.stop) {
			eP.stop()
			delete eP.stop
		}
	}


	// ===== helpers =====

	function engineE (id: string) {
		if (!entities[id]) {
			addEntity({ id })
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


	function engineP (id: string) {
		return engine.ps[id] || (engine.ps[id] = {
			id,
			arcs: {},
			sink: () => { }
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
		replaceGraph,

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

		PORT_TYPES: { ...PORT_TYPES }
	}
}
