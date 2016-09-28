import {Procedure} from '../runtime-types'

export function evaluate(code: string, context: any): Procedure {
  const prefix = "(function(){ return "
  const postfix = "})"
  const factory = eval(prefix + code + postfix)
  return factory.call(context)
}
