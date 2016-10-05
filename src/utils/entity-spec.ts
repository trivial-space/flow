import {EntityData, Graph, ProcessData, Procedure, Meta, Ports, PortType} from "../runtime-types"


// ===== types =====

export interface EntitySpec {
  val?: any
  stream?: ProcessSpec
  streams?: ProcessSpec[]
  json?: string
  isEvent?: boolean
  meta?: Meta
}


export interface ProcessSpec {
  do: Procedure
  with?: {[portId: string]: string}
  id?: string
  async?: boolean
  autostart?: boolean
  meta?: Meta
}


export type Spec = { [id: string]: EntitySpec }


// ===== Api =====

const processNameSuffix = "Stream"

const portTypeMap = {
  H: "HOT",
  C: "COLD",
  A: "ACCUMULATOR"
}


function parseDepsString(str: string) {
  const [type, eid] = str.split(' ')

  const portType: PortType = portTypeMap[type.toUpperCase()] as PortType

  return { type: portType, eid }
}


function mergePath(id: string, path: string) {
  return path + '.' + id
}


export function processProcessSpec (
  eid: string,
  spec: ProcessSpec,
  path?: string
): Graph {

  if (path) {
    eid = mergePath(eid, path)
  }

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

        if (port.eid.indexOf('#') === 0 ) {
          const depId = port.eid.substr(1)
          port.eid = path ? mergePath(depId, path) : depId
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

  const id = path ? mergePath(eid, path): eid

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
