export function evaluate(code, context) {
    var prefix = "(function(){ return ";
    var postfix = "})";
    var factory = eval(prefix + code + postfix);
    return factory.call(context);
}
//# sourceMappingURL=code-evaluator.js.map