import {
  PORT_TYPES,
  PortType,
  Runtime,
} from '../runtime-types'


export interface PortSpec<T> {
  type: PortType,
  entity: EntityRef<T>
}


export type ProcedureSync<T> = (
  ports: { [portId: string]: any }
) => T | undefined


export type ProcedureAsync<T> = (
  ports: { [portId: string]: any },
  send: (val?: T) => void
) => any


export interface ProcessSyncSpec<T> {
  do: ProcedureSync<T>
  with?: {[portId: string]: PortSpec<T>}
  id?: string
  async?: false
  autostart?: boolean
}


export interface ProcessAsyncSpec<T> {
  do: ProcedureAsync<T>
  with?: {[portId: string]: PortSpec<T>}
  id?: string
  async: true
  autostart?: boolean
}


export type ProcessSpec<T> = ProcessSyncSpec<T> | ProcessAsyncSpec<T>


export interface EntityRef<T> {
  id: (_id: string) => EntityRef<T>
  value: (_value: T) => EntityRef<T>
  json: (_json: string) => EntityRef<T>
  isEvent: (_isEvent?: boolean) => EntityRef<T>
  stream: (spec: ProcessSpec<T>) => EntityRef<T>
  HOT: PortSpec<T>
  COLD: PortSpec<T>
  SELF: PortSpec<T>
  getId: () => string
  onId: (cb: (string) => void) => void
}


export interface EntityFactory {
  SELF: PortSpec<any>
  <T>(value?: T): EntityRef<T>
}


const processNameSuffix = "Stream"


function mergePath(id: string, path?: string): string {
  return path ? path + '.' + id : id
}


export function create(flow: Runtime) {

  const SELF = {
    type: PORT_TYPES.ACCUMULATOR
  } as PortSpec<any>

  function entity<T>(value?: T): EntityRef<T> {
    var id: string
    var json: string
    var isEvent: boolean

    var idCallbacks: ((id: string) => void)[] = []

    const ref = {} as EntityRef<T>

    ref.HOT = {
      type: PORT_TYPES.HOT,
      entity: ref
    }

    ref.COLD = {
      type: PORT_TYPES.COLD,
      entity: ref
    }

    ref.SELF = SELF

    function updateEntity() {
      id && flow.addEntity({ id, value, json, isEvent })
    }


    ref.getId = () => id

    ref.onId = (cb) => {
      idCallbacks.push(cb)
      id && cb(id)
    }

    ref.id = (_id: string) => {
      id && id != _id && flow.removeEntity(id)
      id = _id
      updateEntity()
      idCallbacks.forEach(cb => cb(id))
      return ref
    }

    ref.value = (_value: T) => {
      value = _value
      updateEntity()
      return ref
    }

    ref.json = (_json: string) => {
      json = _json
      updateEntity()
      return ref
    }

    ref.isEvent = (_isEvent: boolean = true) => {
      isEvent = _isEvent
      updateEntity()
      return ref
    }

    ref.stream = (spec: ProcessSpec<T>) => {
      ref.onId(id => {
        const procedure = spec.do
        const pid = spec.id || id + processNameSuffix
        let ports

        if (spec.with) {
          ports = {}
          for (let portId in spec.with) {
            const port = spec.with[portId]
            ports[portId] = port.type
          }
        }

        flow.addProcess({
          id: pid,
          procedure,
          ports,
          async: spec.async,
          autostart: spec.autostart
        })

        flow.addArc({ process: pid, entity: id })

        if (spec.with) {
          for (let portId in spec.with) {
            const dep = spec.with[portId]
            if (dep.type !== SELF.type) {
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
      return ref
    }

    return ref
  }


  (entity as EntityFactory).SELF = SELF


  function addToFlow(
    es: any,
    path?: string
  ): void {
    for (let id in es) {
      const e = es[id]
      if (typeof e.id === "function" && e.HOT && e.COLD && e.SELF) {
        const eid = mergePath(id, path)
        e.id(eid)
      }
    }
  }


  return {
    entity: entity as EntityFactory,
    addToFlow,
    SELF
  }
}
