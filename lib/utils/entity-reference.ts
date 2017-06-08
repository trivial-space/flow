import * as graphs from './graph-utils'
import { PORT_TYPES, PortType, ProcessData, Graph, createEntity, createProcess, createArc, AcceptPredicate } from '../runtime-types'
import { v4 } from './uuid'


export interface PortSpec<T> {
	type: PortType,
	entity: EntityRef<T>
}


export type ProcedureSync<T> = (
	...args: any[]
) => T | void


export type ProcedureReact<T> = (
	self: T,
	...args: any[]
) => T | void


export type ProcedureAsync<T> = (
	send: (val?: T) => void,
	...args: any[]
) => (() => void) | void

export type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>


export interface StreamFactory {
	<T>(deps: null, p: () => T, id?: string): EntityRef<T>
	<T, A>(deps: [PortSpec<A>], p: (a: A) => T, id?: string): EntityRef<T>
	<T, A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (a: A, b: B) => T, id?: string): EntityRef<T>
	<T, A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (a: A, b: B, c: C) => T, id?: string): EntityRef<T>
	<T, A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (a: A, b: B, c: C, d: D) => T, id?: string): EntityRef<T>
	<T, A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (a: A, b: B, c: C, d: D, e: E) => T, id?: string): EntityRef<T>
	<T, A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (a: A, b: B, c: C, d: D, e: E, f: F) => T, id?: string): EntityRef<T>
}

export interface AsyncStreamFactory {
	<T>(deps: null, p: (send: (val?: T) => void) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A>(deps: [PortSpec<A>], p: (send: (val?: T) => void, a: A) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (send: (val?: T) => void, a: A, b: B) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (send: (val?: T) => void, a: A, b: B, c: C) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D, e: E) => ((() => void) | void), id?: string): EntityRef<T>
	<T, A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D, e: E, f: F) => ((() => void) | void), id?: string): EntityRef<T>
}

export interface ReactionFactory<T> {
	<A>(deps: [PortSpec<A>], p: (self: T, a: A) => T, id?: string): EntityRef<T>
	<A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (self: T, a: A, b: B) => T, id?: string): EntityRef<T>
	<A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (self: T, a: A, b: B, c: C) => T, id?: string): EntityRef<T>
	<A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (self: T, a: A, b: B, c: C, d: D) => T, id?: string): EntityRef<T>
	<A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (self: T, a: A, b: B, c: C, d: D, e: E) => T, id?: string): EntityRef<T>
	<A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (self: T, a: A, b: B, c: C, d: D, e: E, f: F) => T, id?: string): EntityRef<T>
}


export interface EntityRef<T> {
	id: (_id: string, _ns?: string) => EntityRef<T>
	getId: () => string
	val: (value: T) => EntityRef<T>
	accept: (a: AcceptPredicate<T>) => EntityRef<T>
	react: ReactionFactory<T>
	HOT: PortSpec<T>
	COLD: PortSpec<T>
	getGraph: () => Graph
}


export interface EntitySpec<T> {
	id?: string
	value?: T
	processId?: string
	pidSuffix?: string
	procedure?: Procedure<T>
	dependencies?: PortSpec<any>[]
	async?: boolean
	autostart?: boolean
}


type Deps = PortSpec<any>[] | null

const streamNameSuffix = 'Stream'
const reactionNameSuffix = 'Reaction'


function mergePath (id: string, path?: string): string {
	return path ? path + '.' + id : id
}


function createEntityRef<T>(spec: EntitySpec<T>): EntityRef<T> {

	let value = spec.value
	let id = v4()
	let ns: string | undefined
	let accept: AcceptPredicate<T> | undefined

	const streams: EntitySpec<T>[] = []

	const entity = {} as EntityRef<T>

	entity.HOT = {
		entity,
		type: PORT_TYPES.HOT
	}

	entity.COLD = {
		entity,
		type: PORT_TYPES.COLD
	}

	entity.id = (_id: string, _ns?: string) => {
		id = mergePath(_id, _ns)
		ns = _ns
		return entity
	}

	entity.val = (_value: T) => {
		value = _value
		return entity
	}

	entity.accept = (a: AcceptPredicate<T>) => {
		accept = a
		return entity
	}

	entity.getId = () => id

	if (spec.procedure) {
		streams.push(spec)
	}

	entity.react = (dependencies: Deps, procedure: Procedure<T>, processId?: string) => {
		const spec = getStreamSpec<T>(dependencies, procedure, processId)
		spec.pidSuffix = reactionNameSuffix

		const deps = spec.dependencies
		spec.dependencies = [{ entity, type: PORT_TYPES.ACCUMULATOR } as PortSpec<any>]
		if (deps && deps.length) {
			spec.dependencies = spec.dependencies.concat(deps)
		}

		streams.push(spec)
		return entity
	}

	entity.getGraph = () => {
		const graph = graphs.empty()

		graph.entities[id] = createEntity({ id, value, accept })

		streams.forEach(streamSpec => {
			const deps = streamSpec.dependencies

			const pid = streamSpec.processId ?
				mergePath(streamSpec.processId, ns) :
				id + streamSpec.pidSuffix + (deps && deps.length
					? ':' + (deps.reduce((name, dep) => {
						const depId = dep.entity.getId()
						if (depId === id) { return name }
						return name + ':' + depId
					}, ''))
					: '')

			const ports: PortType[] = []

			if (deps) {
				deps.forEach((port, portId) => {
					ports[portId] = port.type

					if (port.type !== PORT_TYPES.ACCUMULATOR) {
						const arc = createArc({
							process: pid,
							entity: port.entity.getId(),
							port: portId
						})
						graph.arcs[arc.id] = arc
					}
				})
			}

			const arc = createArc({ process: pid, entity: id })
			graph.arcs[arc.id] = arc

			graph.processes[pid] = createProcess({
				id: pid,
				ports,
				procedure: streamSpec.procedure,
				async: streamSpec.async,
				autostart: streamSpec.autostart
			} as ProcessData)
		})

		return graph
	}

	return entity
}


export function val<T>(value?: T): EntityRef<T> {
	return createEntityRef({ value })
}


function getStreamSpec<T>(
	dependencies: PortSpec<any>[] | null,
	procedure: Procedure<T>,
	processId?: string
): EntitySpec<T> {

	const spec: EntitySpec<T> = {
		procedure: procedure
	}

	if (dependencies != null) {
		spec.dependencies = dependencies
	}

	if (typeof processId === 'string') {
		spec.processId = processId
	} else {
		spec.pidSuffix = streamNameSuffix
	}

	return spec
}


export const stream: StreamFactory = (<T>(
	dependencies: Deps,
	procedure: ProcedureSync<T>,
	processId?: string
) =>
	createEntityRef(getStreamSpec(dependencies, procedure, processId))) as StreamFactory


export const asyncStream: AsyncStreamFactory = (<T>(
	dependencies: Deps,
	procedure: ProcedureAsync<T>,
	processId?: string
) =>
	createEntityRef<T>({
		...getStreamSpec<T>(dependencies, procedure, processId),
		async: true
	})) as AsyncStreamFactory


export const streamStart: StreamFactory = (<T>(
	dependencies: Deps,
	procedure: ProcedureSync<T>,
	processId?: string
) =>
	createEntityRef<T>({
		...getStreamSpec<T>(dependencies, procedure, processId),
		autostart: true
	})) as StreamFactory


export const asyncStreamStart: AsyncStreamFactory = (<T>(
	dependencies: Deps,
	procedure: ProcedureAsync<T>,
	processId?: string
) =>
	createEntityRef<T>({
		...getStreamSpec<T>(dependencies, procedure, processId),
		async: true,
		autostart: true
	})) as AsyncStreamFactory


export function isEntity<T>(e: any): e is EntityRef<T> {
	return e &&
		typeof e.id === 'function' &&
		typeof e.getGraph === 'function' &&
		e.HOT && e.COLD
}


export function resolveEntityIds (
	entities: { [id: string]: any },
	path?: string
): any {

	for (const id in entities) {
		const e = entities[id]
		if (isEntity(e)) {
			e.id(id, path)
		}
	}

	return entities
}


export function getGraphFromAll (
	entities: any
): Graph {

	const es: EntityRef<any>[] = []

	for (const id in entities) {
		const e = entities[id]
		if (isEntity(e)) {
			es.push(e)
		}
	}

	return es.reduce(
		(g, e) => graphs.merge(g, e.getGraph()),
		graphs.empty()
	)
}
