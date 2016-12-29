import {v4} from './utils/uuid'
import {evaluate} from './utils/code-evaluator'


// ===== type definitions =====

export type Meta = {[m: string]: any}


export interface EntityData {
  id?: string
  value?: any
  json?: string
  isEvent?: boolean
  meta?: Meta
}


export interface Entity {
  id: string
  value?: any
  json?: string
  isEvent?: boolean
  meta: Meta
}


export type PortTypeHot = "HOT"
export type PortTypeCold = "COLD"
export type PortTypeAccumulator = "ACCUMULATOR"

export type PortType = PortTypeHot | PortTypeCold | PortTypeAccumulator


export type ProcedureSync = (
  ...args: any[]
) => any


export type ProcedureAsync = (
  send: (val?: any) => void,
  ...args: any[]
) => any


export type Procedure = ProcessSync | ProcedureAsync


export interface ProcessDataSync {
  id?: string
  ports?: PortType[]
  procedure?: ProcedureSync
  code?: string
  autostart?: boolean
  async?: false
  meta?: Meta
}


export interface ProcessDataAsync {
  id?: string
  ports?: PortType[]
  procedure?: ProcedureAsync
  code?: string
  autostart?: boolean
  async: true
  meta?: Meta
}

export type ProcessData = ProcessDataSync | ProcessDataAsync


export interface ProcessSync {
  id: string
  ports: PortType[]
  procedure: ProcedureSync
  code: string
  autostart?: boolean
  async: false
  meta: Meta
}


export interface ProcessAsync {
  id: string
  ports: PortType[]
  procedure: ProcedureAsync
  code: string
  autostart?: boolean
  async: true
  meta: Meta
}


export type Process = ProcessSync | ProcessAsync


export interface ArcData {
  id?: string
  entity: string
  process: string
  port?: number | string
  meta?: Meta
}


export interface Arc {
  id: string
  entity: string
  process: string
  port?: number | string
  meta: Meta
}


export interface Graph {
  entities: {[id: string]: EntityData},
  processes: {[id: string]: ProcessData},
  arcs: {[id: string]: ArcData},
  meta?: Meta
}

export interface GraphData {
  entities?: EntityData[] | {[id: string]: EntityData},
  processes?: ProcessData[] | {[id: string]: ProcessData},
  arcs?: ArcData[] | {[id: string]: ArcData},
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
    getGraph: () => Graph
    getState: () => {}
    setMeta: (newMeta: any) => void
    getMeta: () => Meta
    getContext: () => null
    setContext: (ctx: any) => void
    setDebug: (isDebug: boolean) => void
    get: (id: string) => any
    set: (id: string, value?: any) => void
    update: (id: string, fn: (val: any) => any) => void
    on: (id: string, cb: (val: any) => void) => void
    off: (id: string) => void
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
  isEvent,
  meta
}: EntityData): Entity {
  return {
    id,
    value,
    json,
    isEvent,
    meta: Object.assign({}, meta)
  }
}


export function createProcess ({
  id = v4(),
  ports = [],
  procedure,
  code,
  autostart = false,
  async = false,
  meta
}: ProcessData, context?): Process {

  // calculated values
  if (procedure == null && code != null) {
    procedure = evaluate(code, context)
  }
  if (code == null && procedure) code = procedure.toString()
  if (code == null || procedure == null) {
    throw TypeError('Process must have procedure or code set')
  }

  return {
    id,
    ports,
    procedure,
    code,
    autostart,
    async,
    meta: Object.assign({}, meta)
  } as Process
}


export function createArc ({
  id,
  entity,
  process,
  port,
  meta,
}: ArcData): Arc {

  if (entity == null) {
    throw TypeError("no entity specified in arc " + id)
  }
  if (process == null) {
    throw TypeError("no process specified in arc " + id)
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
    meta: Object.assign({}, meta)
  }
}


// ===== Porttypes =====

export const PORT_TYPES = {
  COLD: 'COLD' as PortTypeCold,
  HOT: 'HOT' as PortTypeHot,
  ACCUMULATOR: 'ACCUMULATOR' as PortTypeAccumulator
}
