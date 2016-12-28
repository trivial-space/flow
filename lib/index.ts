import * as r from "./runtime"
import * as entityRef from './utils/entity-reference'
import * as t from './runtime-types'

export default r
export const runtime = r
export * from './runtime'

export const types = t
export const utils = {
  entityRef
}
