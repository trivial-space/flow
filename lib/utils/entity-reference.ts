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
  val: (value: T) => EntityRef<T>
  react: ReactionFactory<T>
  HOT: PortSpec<T>
  COLD: PortSpec<T>
  getGraph: () => Graph
  onId: (cb: (string) => void) => void
}


export interface EntitySpec<T> {
  id?: string
  value?: T
  processId?: string
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


function createEntityGraph<T>(spec: EntitySpec<T>): EntityRef<T> {
  const graph: Graph = graphs.empty()

  let value = spec.value
  let id: string | undefined
  let ns: string | undefined
  let reactionCount = 0

  const idCallbacks: ((id: string) => void)[] = []

  const entity = {} as EntityRef<T>

  entity.HOT = {
    entity,
    type: PORT_TYPES.HOT
  }

  entity.COLD = {
    entity,
    type: PORT_TYPES.COLD
  }

  function updateEntity() {
    if (id) {
      graph.entities[id] = createEntity({id, value})
    }
  }

  entity.getGraph = () => graph

  entity.onId = (cb) => {
    idCallbacks.push(cb)
    id && cb(id)
  }

  entity.id = (_id: string, _ns?: string) => {
    let tempId = mergePath(_id, _ns)
    if (id === tempId) return entity
    id && delete graph.entities[id]
    ns = _ns
    id = tempId
    updateEntity()
    idCallbacks.forEach(cb => cb(tempId))
    return entity
  }

  entity.val = (_value: T) => {
    value = _value
    updateEntity()
    return entity
  }


  function registerStream(spec: EntitySpec<T>, suffix) {

    entity.onId(id => {
      const pid = spec.processId ? mergePath(spec.processId, ns) : id + suffix

      const deps = spec.dependencies
      let ports: PortType[] = []

      if (deps) {
        for (let portId in deps) {
          const port = deps[portId]
          ports[portId] = port.type
        }
      }

      graph.processes[pid] = createProcess({
        id: pid,
        procedure: spec.procedure,
        ports,
        async: spec.async,
        autostart: spec.autostart
      } as ProcessData)

      const arc = createArc({ process: pid, entity: id })
      graph.arcs[arc.id] = arc

      if (deps) {
        for (let portId in deps) {
          const dep = deps[portId]
          if (dep.type !== PORT_TYPES.ACCUMULATOR) {
            dep.entity.onId(id => {
              const arc = createArc({ process: pid, entity: id, port: portId })
              graph.arcs[arc.id] = arc
            })
          }
        }
      }
    })
  }

  if (spec.procedure) {
    registerStream(spec, streamNameSuffix)
  }

  entity.react = (
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ) => {

    const spec = getStreamSpec<T>(a1, a2, a3)
    const deps = spec.dependencies
    spec.dependencies = [{entity, type: PORT_TYPES.ACCUMULATOR} as PortSpec<any>]

    if (deps && deps.length) {
      spec.dependencies = spec.dependencies.concat(deps)
    }

    registerStream(spec, reactionNameSuffix + reactionCount++)
    return entity
  }

  return entity
}


export function val<T>(value?: T): EntityRef<T> {
  return createEntityGraph({ value })
}


function getStreamSpec<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntitySpec<T> {

  if (typeof a1 === "function") {
    return ({
      procedure: a1
    })

  } else if (Array.isArray(a1) && typeof a2 === "function") {
    return ({
      dependencies: a1,
      procedure: a2
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
    return createEntityGraph<T>(getStreamSpec<T>(a1, a2, a3))
}


export function asyncStream<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityGraph<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      async: true
    })
}


export function streamStart<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityGraph<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      autostart: true
    })
}


export function asyncStreamStart<T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
): EntityRef<T> {
    return createEntityGraph<T>({
      ...getStreamSpec<T>(a1, a2, a3),
      async: true,
      autostart: true
    })
}


export function isEntity(e: any): boolean {
  return e &&
      typeof e.id === "function" &&
      typeof e.getGraph === "function" &&
      e.HOT && e.COLD
}


export function resolveEntities(
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


export function getGraphFromEntities(
  entities: any
): Graph {

  const es: EntityRef<any>[] = []

  for (let id in entities) {
    const e = entities[id]
    if (isEntity(e)) {
      es.push(e)
    }
  }

  return es.reduce((g, e) => graphs.merge(g, e.getGraph()), graphs.empty())
}
