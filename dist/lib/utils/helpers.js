var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
export function deepmerge(obj1, obj2) {
    if (typeof obj1 === 'object'
        && typeof obj2 === 'object'
        && !Array.isArray(obj1)
        && !Array.isArray(obj2)
        && obj1 !== obj2) {
        var result = __assign({}, obj1);
        for (var key in obj2) {
            var val1 = obj1[key];
            var val2 = obj2[key];
            if (typeof val2 !== 'undefined') {
                result[key] = deepmerge(val1, val2);
            }
            else {
                delete result[key];
            }
        }
        return result;
    }
    return obj2;
}
//# sourceMappingURL=helpers.js.map