import {
  PORT_TYPES,
  PortType,
  Runtime,
  ProcessData
} from '../runtime-types'


export type PortSpec<T> = {
  type: PortType,
  entity: EntityRef<T>
}


export type ProcedureSync<T> = (
  ...args: any[]
) => T | void


export type ProcedureAsync<T> = (
  send: (val?: T) => void,
  ...args: any[]
) => (() => void) | void

export type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>


export type ReactionFactory<T> = (
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
) => EntityRef<T>


export type StreamFactory = <T>(
  a1: string | PortSpec<any>[] | Procedure<T>,
  a2?: PortSpec<any>[] | Procedure<T>,
  a3?: Procedure<T>
) => EntityRef<T>


export type ValueFactory = <T>(value?: T) => EntityRef<T>

export type JsonValueFactory = <T>(json?: string) => EntityRef<T>


export type EntityRef<T> = {
  id: (_id: string, _ns?: string) => EntityRef<T>
  isEvent: (_isEvent?: boolean) => EntityRef<T>
  react: ReactionFactory<T>
  HOT: PortSpec<T>
  COLD: PortSpec<T>
  getId: () => string | undefined
  onId: (cb: (string) => void) => void
}


export type EntitySpec<T> = {
  id?: string
  value?: T
  json?: string
  processId?: string
  procedure?: Procedure<T>
  dependencies?: PortSpec<any>[]
  async?: boolean
  autostart?: boolean
}

export type EntityFactory = {
  val: ValueFactory,
  json: JsonValueFactory,
  stream: StreamFactory,
  asyncStream: StreamFactory,
  streamStart: StreamFactory,
  asyncStreamStart: StreamFactory,
  addToFlow: (entities: {[id: string]: EntityRef<any>}, ns?: string) => void
}

const streamNameSuffix = "Stream"
const reactionNameSuffix = "Reaction"


function mergePath(id: string, path?: string): string {
  return path ? path + '.' + id : id
}


export function create(flow: Runtime): EntityFactory {

  function createEntity<T>(spec: EntitySpec<T>): EntityRef<T> {
    let isEvent: boolean | undefined
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
      id && flow.addEntity({
        id,
        isEvent,
        value: spec.value,
        json: spec.json
      })
    }


    entity.getId = () => id

    entity.onId = (cb) => {
      idCallbacks.push(cb)
      id && cb(id)
    }

    entity.id = (_id: string, _ns?: string) => {
      let tempId = mergePath(_id, _ns)
      if (id === tempId) return entity
      id && flow.removeEntity(id)
      ns = _ns
      id = tempId
      updateEntity()
      idCallbacks.forEach(cb => cb(tempId))
      return entity
    }

    entity.isEvent = (_isEvent: boolean = true) => {
      isEvent = _isEvent
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

        flow.addProcess({
          id: pid,
          procedure: spec.procedure,
          ports,
          async: spec.async,
          autostart: spec.autostart
        } as ProcessData)

        flow.addArc({ process: pid, entity: id })

        if (deps) {
          for (let portId in deps) {
            const dep = deps[portId]
            if (dep.type !== PORT_TYPES.ACCUMULATOR) {
              dep.entity.onId(id => {
                flow.addArc({
                  entity: id,
                  process: pid,
                  port: portId
                })
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


  function val<T>(value?: T): EntityRef<T> {
    return createEntity({ value })
  }


  function json<T>(json: string): EntityRef<T> {
    return createEntity({ json })
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


  function stream<T>(
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ): EntityRef<T> {
      return createEntity<T>(getStreamSpec<T>(a1, a2, a3))
  }


  function asyncStream<T>(
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ): EntityRef<T> {
      return createEntity<T>({
        ...getStreamSpec<T>(a1, a2, a3),
        async: true
      })
  }


  function streamStart<T>(
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ): EntityRef<T> {
      return createEntity<T>({
        ...getStreamSpec<T>(a1, a2, a3),
        autostart: true
      })
  }


  function asyncStreamStart<T>(
    a1: string | PortSpec<any>[] | Procedure<T>,
    a2?: PortSpec<any>[] | Procedure<T>,
    a3?: Procedure<T>
  ): EntityRef<T> {
      return createEntity<T>({
        ...getStreamSpec<T>(a1, a2, a3),
        async: true,
        autostart: true
      })
  }


  function addToFlow(
    es: any,
    path?: string
  ): void {
    for (let id in es) {
      const e = es[id]
      if (typeof e.id === "function" && e.HOT && e.COLD) {
        e.id(id, path)
      }
    }
  }


  return {
    val,
    json,
    stream,
    streamStart,
    asyncStream,
    asyncStreamStart,
    addToFlow
  }
}
