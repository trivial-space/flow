import * as r from "./runtime"
import * as entityRef from './utils/entity-reference'
import * as graph from './utils/graph-utils'
import * as t from './runtime-types'

export default r
export const runtime = r
export const create = r.create

export const types = t
export const utils = {
  entityRef, graph
}
