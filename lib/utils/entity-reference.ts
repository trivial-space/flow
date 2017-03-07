import * as graphs from './graph-utils'
import {
  PORT_TYPES,
  PortType,
  ProcessData,
  Graph,
  createEntity,
  createProcess,
  createArc
} from '../runtime-types'
import { v4 } from "./uuid";


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


export type ReactionFactory<T> = (
  a1: string | PortSpec<any>[] | ProcedureReact<T>,
  a2?: PortSpec<any>[] | ProcedureReact<T>,
  a3?: ProcedureReact<T>
) => EntityRef<T>


export interface EntityRef<T> {
  id: (_id: string, _ns?: string) => EntityRef<T>
  getId: () => string
  val: (value: T) => EntityRef<T>
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

const streamNameSuffix = "Stream"
const reactionNameSuffix = "Reaction"


function mergePath(id: string, path?: string): string {
  return path ? path + '.' + id : id
}


function createEntityRef<T>(spec: EntitySpec<T>): EntityRef<T> {

  let value = spec.value
  let id = v4()
  let ns: string | undefined
  let reactionCount = 0

  let streams: EntitySpec<T>[] = []

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

  entity.getId = () => id

  if (spec.procedure) {
    streams.push(spec)
  }

  entity.react = (
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ) => {

    const spec = getStreamSpec<T>(a1, a2, a3)
    spec.pidSuffix = reactionNameSuffix + reactionCount++

    const deps = spec.dependencies
    spec.dependencies = [{entity, type: PORT_TYPES.ACCUMULATOR} as PortSpec<any>]
    if (deps && deps.length) {
      spec.dependencies = spec.dependencies.concat(deps)
    }

    streams.push(spec)
    return entity
  }

  entity.getGraph = () => {
    const graph = graphs.empty()

    graph.entities[id] = createEntity({id, value})

    streams.forEach(streamSpec => {
      const pid = streamSpec.processId ?
        mergePath(streamSpec.processId, ns) :
        id + streamSpec.pidSuffix

      const deps = streamSpec.dependencies
      let ports: PortType[] = []

      if (deps) {
        for (let portId in deps) {
          const port = deps[portId]
          ports[portId] = port.type

          if (port.type !== PORT_TYPES.ACCUMULATOR) {
            const arc = createArc({ process: pid, entity: port.entity.getId(), port: portId })
            graph.arcs[arc.id] = arc
          }
        }
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
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntitySpec<T> {

  if (typeof a1 === "function") {
    return ({
      procedure: a1,
      pidSuffix: streamNameSuffix
    })

  } else if (Array.isArray(a1) && typeof a2 === "function") {
    return ({
      dependencies: a1,
      procedure: a2,
      pidSuffix: streamNameSuffix
    })

  } else if (typeof a1 === "string" && typeof a2 === "function") {
    return ({
      processId: a1,
      procedure: a2
    })

  } else if (typeof a1 === "string" && Array.isArray(a2) && typeof a3 === "function") {
    return ({
      processId: a1,
      dependencies: a2,
      procedure: a3
    })

  } else {
    throw TypeError('Wrong stream arguments')
  }
}


export function stream<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityRef<T>(getStreamSpec<T>(a1, a2, a3))
}


export function asyncStream<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityRef<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      async: true
    })
}


export function streamStart<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityRef<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      autostart: true
    })
}


export function asyncStreamStart<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityRef<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      async: true,
      autostart: true
    })
}


export function isEntity<T>(e: any): e is EntityRef<T>  {
  return e &&
      typeof e.id === "function" &&
      typeof e.getGraph === "function" &&
      e.HOT && e.COLD
}


export function resolveEntityIds(
  entities: {[id: string]: any},
  path?: string
): any {

  for (let id in entities) {
    const e = entities[id]
    if (isEntity(e)) {
      e.id(id, path)
    }
  }

  return entities
}


export function getGraphFromAll(
  entities: Object
): Graph {

  const es: EntityRef<any>[] = []

  for (let id in entities) {
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
