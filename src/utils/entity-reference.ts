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
  id: (string) => EntityRef
  value: (any) => EntityRef
  json: (string) => EntityRef
  isEvent: (boolean) => EntityRef
  stream: (ProcessSpec) => EntityRef
  HOT: PortSpec
  COLD: PortSpec
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

  function entity(value: any): EntityRef {
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


    function updateEntity() {
      id && flow.addEntity({ id, value, json, isEvent })
    }


    ref.getId = () => id

    ref.onId = (cb) => {
      idCallbacks.push(cb)
      id && cb(id)
    }

    ref.id = (newId: string) => {
      id && flow.removeEntity(id)
      id = newId
      updateEntity()
      idCallbacks.forEach(cb => cb(id))
      return ref
    }

    ref.value = (val: any) => {
      value = val
      updateEntity()
      return ref
    }

    ref.json = (newJson: any) => {
      json = newJson
      updateEntity()
      return ref
    }

    ref.isEvent = (event: boolean = true) => {
      isEvent = event
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
    es: {[id: string]: EntityRef},
    path?: string
  ): void {
    for (let id in es) {
      const eid = mergePath(id, path)
      const e = es[id]
      e.id(eid)
    }
  }


  return {entity, addToFlow, SELF}
}
