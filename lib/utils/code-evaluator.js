export function evaluate(code, context) {
    const prefix = "(function(){ return ";
    const postfix = "})";
    const factory = eval(prefix + code + postfix);
    return factory.call(context);
}
//# sourceMappingURL=code-evaluator.js.map