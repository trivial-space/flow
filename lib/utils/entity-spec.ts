import {
  EntityData,
  Graph,
  ProcessData,
  ProcedureSync,
  ProcedureAsync,
  Meta,
  Ports,
  PortType,
  PORT_TYPES
} from "../runtime-types"


// ===== types =====

export type EntitySpec = {
  val?: any
  stream?: ProcessSpec
  streams?: ProcessSpec[]
  json?: string
  isEvent?: boolean
  meta?: Meta
}


export type ProcessSyncSpec = {
  do: ProcedureSync
  with?: {[portId: string]: string}
  id?: string
  async?: false
  autostart?: boolean
  meta?: Meta
}


export type ProcessAsyncSpec = {
  do: ProcedureAsync
  with?: {[portId: string]: string}
  id?: string
  async: true
  autostart?: boolean
  meta?: Meta
}


export type ProcessSpec = ProcessSyncSpec | ProcessAsyncSpec


export type Spec = { [id: string]: EntitySpec }


// ===== Api =====

const processNameSuffix = "Stream"

const portTypeMap = {
  H: PORT_TYPES.HOT,
  C: PORT_TYPES.COLD,
  A: PORT_TYPES.ACCUMULATOR
}


function parseDepsString(str: string) {
  const [type, eid] = str.split(' ')

  const portType: PortType = portTypeMap[type.toUpperCase()] as PortType

  return { type: portType, eid }
}


function mergePath(id: string, path?: string): string {
  return path ? path + '.' + id : id
}


function resolvePath(id: string, path?: string): string {
  const prefix = /^\.*/.exec(id)
  const length = prefix ? prefix[0].length : 0
  const depId = id.substr(length)
  if (path) {
    const steps = path.trim().split('.')
    for (let i = 0; i < length - 1; i++) {
      steps.pop()
    }
    path = steps.join('.')
    return mergePath(depId, path)
  }
  return depId
}


export function processProcessSpec (
  eid: string,
  spec: ProcessSpec,
  path?: string
): Graph {

  eid = mergePath(eid, path)

  const pid = spec.id || eid + processNameSuffix

  const process: ProcessData = {
    id: pid,
    procedure: spec.do
  }

  const graph: Graph = {
    entities: [] as EntityData[],
    processes: [process],
    arcs: [{
      process: pid,
      entity: eid
    }]
  }

  if (spec.autostart) {
    process.autostart = spec.autostart
  }

  if (spec.async) {
    process.async = spec.async
  }

  if (spec.meta) {
    process.meta = spec.meta
  }

  if (spec.with) {
    process.ports = {} as Ports

    for (let portId in spec.with) {
      const port = parseDepsString(spec.with[portId])
      process.ports[portId] = port.type
      if (port.eid) {

        if (port.eid.indexOf('.') === 0 ) {
          port.eid = resolvePath(port.eid, path)
        }

        graph.arcs.push({
          entity: port.eid,
          process: pid,
          port: portId
        })
      }
    }
  }

  return graph
}


function newGraph(): Graph {
  return {
    entities: [],
    processes: [],
    arcs: []
  }
}


function mergeGraphs(g1: Graph, g2: Graph): Graph {
  return {
    entities: g1.entities.concat(g2.entities),
    processes: g1.processes.concat(g2.processes),
    arcs: g1.arcs.concat(g2.arcs)
  }
}


export function processEntitySpec (
  eid: string,
  spec: EntitySpec,
  path?: string
): Graph {

  let graph = newGraph()

  const id = mergePath(eid, path)

  const entity: EntityData = { id }

  if (spec.val != null) {
    entity.value = spec.val
  }

  if (spec.json) {
    entity.json = spec.json
  }

  if (spec.isEvent) {
    entity.isEvent = spec.isEvent
  }

  if (spec.meta) {
    entity.meta = spec.meta
  }

  if (spec.stream) {
    graph = mergeGraphs(graph, processProcessSpec(eid, spec.stream, path))
  }

  if (spec.streams) {
    graph = spec.streams
      .map(pSpec => processProcessSpec(eid, pSpec, path))
      .map((graph, i) => {
        graph.processes[0].id += i + 1
        graph.arcs.forEach(a => a.process += i + 1)
        return graph
      })
      .reduce(mergeGraphs, graph)
  }

  graph.entities.push(entity)

  return graph
}


export function toGraph (spec: Spec, path?: string): Graph {
  return Object.keys(spec)
    .map(id => processEntitySpec(id, spec[id], path))
    .reduce(mergeGraphs, newGraph())
}
