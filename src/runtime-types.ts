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


export type PortType = "HOT" | "COLD" | "ACCUMULATOR"


export type Ports = {[portId: string]: PortType}


export type Procedure = (
  ports: { [portId: string]: any },
  send?: (val: any) => void
) => any


export interface ProcessData {
  id?: string
  ports?: Ports
  procedure?: Procedure
  code?: string
  autostart?: boolean
  async?: boolean
  meta?: Meta
}


export interface Process {
  id: string
  ports: Ports
  procedure: Procedure
  code: string
  autostart?: boolean
  async?: boolean
  meta: Meta
}


export interface ArcData {
  id?: string
  entity: string
  process: string
  port?: string
  meta?: Meta
}


export interface Arc {
  id: string
  entity: string
  process: string
  port?: string
  meta: Meta
}


export interface Graph {
  entities: EntityData[]
  processes: ProcessData[]
  arcs: ArcData[],
  meta?: Meta
}


export interface Runtime {
    addEntity: (spec: EntityData) => Entity
    removeEntity: (id: string) => void
    addProcess: (spec: ProcessData) => Process
    removeProcess: (id: string) => void
    addArc: (spec: ArcData) => Arc
    removeArc: (id: string) => void
    addGraph: (graphSpec: Graph) => void
    getGraph: () => {
        entities: {[id: string]: Entity}
        processes: {[id: string]: Process}
        arcs: {[id: string]: Arc}
        meta: {}
    }
    getState: () => {}
    setMeta: (newMeta: any) => void
    getMeta: () => Meta
    getContext: () => null
    setContext: (ctx: any) => void
    setDebug: (isDebug: boolean) => void
    get: (id: string) => any
    set: (id: string, value: any) => void
    update: (id: string, fn: (val: any) => any) => void
    on: (id: string, cb: (val: any) => void) => void
    off: (id: string) => void
    start: (processId: string) => void
    stop: (processId: string) => void
    PORT_TYPES: {
        COLD: "COLD"
        HOT: "HOT"
        ACCUMULATOR: "ACCUMULATOR"
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
  ports = {},
  procedure,
  code,
  autostart,
  async,
  meta
}: ProcessData, context): Process {

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
    async: async,
    meta: Object.assign({}, meta)
  }
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
  COLD: 'COLD' as 'COLD',
  HOT: 'HOT' as 'HOT',
  ACCUMULATOR: 'ACCUMULATOR' as 'ACCUMULATOR'
}
