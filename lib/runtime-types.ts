import { v4 } from './utils/uuid'
import { evaluate } from './utils/code-evaluator'


// ===== type definitions =====

export type Meta = { [m: string]: any }


export type AcceptPredicate<T> = (
	newValue?: T,
	oldValue?: T
) => boolean


export interface EntityData {
	id?: string
	value?: any
	json?: string
	accept?: AcceptPredicate<any>
	reset?: boolean
	meta?: Meta,
}


export interface Entity {
	id: string
	value?: any
	accept?: AcceptPredicate<any>
	reset?: boolean
	meta?: Meta
}


export type PortTypeHot = 'HOT'
export type PortTypeCold = 'COLD'
export type PortTypeAccumulator = 'ACCUMULATOR'

export type PortType = PortTypeHot | PortTypeCold | PortTypeAccumulator


export type ProcedureSync = ( ...args: any[]) => any

export type ProcedureAsync = ( send: (val?: any) => void, ...args: any[]) => any

export type ProcedureDelta = ( oldVal: any, newVal: any) => any

export type Procedure = ProcessSync | ProcedureAsync | ProcedureDelta


export interface ProcessDataSync {
	id?: string
	ports?: PortType[]
	procedure?: ProcedureSync
	code?: string
	autostart?: boolean
	async?: false
	delta?: false
	meta?: Meta
}


export interface ProcessDataAsync {
	id?: string
	ports?: PortType[]
	procedure?: ProcedureAsync
	code?: string
	autostart?: boolean
	async: true
	delta?: false
	meta?: Meta
}


export interface ProcessDataDelta {
	id?: string
	procedure: ProcedureDelta
	ports?: [PortTypeHot]
	code?: string
	delta: true
	autostart?: false
	async?: false
	meta?: Meta
}


export type ProcessData = ProcessDataSync | ProcessDataAsync | ProcessDataDelta


export interface ProcessSync {
	id: string
	ports: PortType[]
	procedure: ProcedureSync
	autostart?: boolean
	async?: false
	delta?: false
	meta?: Meta
}


export interface ProcessAsync {
	id: string
	ports: PortType[]
	procedure: ProcedureAsync
	autostart?: boolean
	async: true
	delta?: false
	meta?: Meta
}


export interface ProcessDelta {
	id: string
	ports: [PortTypeHot]
	procedure: ProcedureDelta
	delta: true
	autostart?: false
	async?: false
	meta?: Meta
}


export type Process = ProcessSync | ProcessAsync | ProcessDelta


export interface ArcData {
	id?: string
	entity: string
	process: string
	port?: number
	meta?: Meta
}


export interface Arc {
	id: string
	entity: string
	process: string
	port?: number
	meta?: Meta
}


export interface Graph {
	entities: { [id: string]: EntityData },
	processes: { [id: string]: ProcessData },
	arcs: { [id: string]: ArcData },
	meta?: Meta
}

export interface GraphData {
	entities?: EntityData[] | { [id: string]: EntityData },
	processes?: ProcessData[] | { [id: string]: ProcessData },
	arcs?: ArcData[] | { [id: string]: ArcData },
	meta?: Meta
}

export interface Runtime {
	addEntity: (spec: EntityData) => Entity
	removeEntity: (id: string) => void
	addProcess: (spec: ProcessData) => Process
	removeProcess: (id: string) => void
	addArc: (spec: ArcData) => Arc
	removeArc: (id: string) => void
	addGraph: (graphSpec: GraphData) => void
	replaceGraph: (graphSpec: GraphData) => void
	getGraph: () => Graph
	getState: () => { [id: string]: any }
	setMeta: (newMeta: Meta) => void
	getMeta: () => Meta
	getContext: () => null
	setContext: (ctx: any) => void
	setDebug: (isDebug: boolean) => void
	get: (id: string) => any
	set: (id: string, value?: any) => void
	update: (id: string, fn: (val: any) => any) => void
	on: (id: string, cb: (val: any) => void) => void
	off: (id: string, cb?: (val: any) => void) => void
	start: (processId: string) => void
	stop: (processId: string) => void
	flush: () => void
	PORT_TYPES: {
		readonly COLD: PortTypeCold
		readonly HOT: PortTypeHot
		readonly ACCUMULATOR: PortTypeAccumulator
	}
}


// ===== entity system factories =====

export function createEntity ({
  id = v4(),
	value,
	json,
	accept,
	reset,
	meta
}: EntityData): Entity {

	if (value == null && json) {
		value = JSON.parse(json)
	}

	return {
		id,
		value,
		accept,
		reset,
		meta
	}
}


export function createProcess ({
  id = v4(),
	ports = [],
	procedure,
	code,
	autostart = false,
	async = false,
	delta = false,
	meta
}: ProcessData, context?: any): Process {

	// calculated values
	if (procedure == null && code != null) {
		procedure = evaluate(code, context)
	}
	if (procedure == null) {
		throw TypeError('Process must have procedure or code set')
	}

	if (delta && !ports.length) {
		ports.push(PORT_TYPES.HOT)
	}

	return {
		id,
		ports,
		procedure,
		autostart,
		async,
		delta,
		meta
	} as Process
}


export function createArc ({
  id,
	entity,
	process,
	port,
	meta
}: ArcData): Arc {

	if (entity == null) {
		throw TypeError('no entity specified in arc ' + id)
	}
	if (process == null) {
		throw TypeError('no process specified in arc ' + id)
	}
	if (id == null) {
		if (port == null) {
			id = process + '->' + entity
		} else {
			id = entity + '->' + process + '::' + port
		}
	}

	return {
		id,
		entity,
		process,
		port,
		meta
	}
}


// ===== Porttypes =====

export const PORT_TYPES = {
	COLD: 'COLD' as PortTypeCold,
	HOT: 'HOT' as PortTypeHot,
	ACCUMULATOR: 'ACCUMULATOR' as PortTypeAccumulator
}
