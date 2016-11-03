import {
  PORT_TYPES,
  PortType,
  Runtime,
  ProcedureSync,
  ProcedureAsync
} from '../runtime-types'


export interface PortSpec {
  type: PortType,
  entity: EntityRef
}

export interface ProcessSyncSpec {
  do: ProcedureSync
  with?: {[portId: string]: PortSpec}
  id?: string
  async?: false
  autostart?: boolean
}


export interface ProcessAsyncSpec {
  do: ProcedureAsync
  with?: {[portId: string]: PortSpec}
  id?: string
  async: true
  autostart?: boolean
}


export type ProcessSpec = ProcessSyncSpec | ProcessAsyncSpec


export interface EntityRef {
  id: (_id: string) => EntityRef
  value: (_value: any) => EntityRef
  json: (_json: string) => EntityRef
  isEvent: (_isEvent?: boolean) => EntityRef
  stream: (spec: ProcessSpec) => EntityRef
  HOT: PortSpec
  COLD: PortSpec
  SELF: PortSpec
  getId: () => string
  onId: (cb: (string) => void) => void
}


export interface EntityFactory {
  SELF: PortSpec
  (any?): EntityRef
}


const processNameSuffix = "Stream"


function mergePath(id: string, path?: string): string {
  return path ? path + '.' + id : id
}


export function create(flow: Runtime) {

  const SELF = {
    type: PORT_TYPES.ACCUMULATOR
  } as PortSpec

  function entity(value?: any): EntityRef {
    var id: string
    var json: string
    var isEvent: boolean

    var idCallbacks = []

    const ref = {} as EntityRef

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

    ref.value = (_value: any) => {
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

    ref.stream = (spec: ProcessSpec) => {
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
