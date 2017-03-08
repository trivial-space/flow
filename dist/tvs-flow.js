!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.tvsFlow = t() : e.tvsFlow = t();
}(this, function() {
    return function(e) {
        function t(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
        }
        var r = {};
        return t.m = e, t.c = r, t.i = function(e) {
            return e;
        }, t.d = function(e, r, n) {
            t.o(e, r) || Object.defineProperty(e, r, {
                configurable: !1,
                enumerable: !0,
                get: n
            });
        }, t.n = function(e) {
            var r = e && e.__esModule ? function() {
                return e.default;
            } : function() {
                return e;
            };
            return t.d(r, "a", r), r;
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }, t.p = "", t(t.s = 6);
    }([ function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, n = void 0 === t ? r.i(s.a)() : t, o = e.value, c = e.json, i = e.accept, u = e.meta;
            return null == o && c && (o = JSON.parse(c)), {
                id: n,
                value: o,
                accept: i,
                meta: a({}, u)
            };
        }
        function o(e, t) {
            var n = e.id, o = void 0 === n ? r.i(s.a)() : n, c = e.ports, u = void 0 === c ? [] : c, f = e.procedure, p = e.code, l = e.autostart, d = void 0 !== l && l, v = e.async, y = void 0 !== v && v, O = e.meta;
            if (null == f && null != p && (f = r.i(i.a)(p, t)), null == f) throw TypeError("Process must have procedure or code set");
            return {
                id: o,
                ports: u,
                procedure: f,
                autostart: d,
                async: y,
                meta: a({}, O)
            };
        }
        function c(e) {
            var t = e.id, r = e.entity, n = e.process, o = e.port, c = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == o ? n + "->" + r : r + "->" + n + "::" + o), {
                id: t,
                entity: r,
                process: n,
                port: o,
                meta: a({}, c)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = r(2), i = r(5);
        t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return u;
        });
        var a = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, u = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            return {
                entities: {},
                processes: {},
                arcs: {},
                meta: {}
            };
        }
        function o(e, t) {
            return {
                entities: c({}, e.entities, t.entities),
                processes: c({}, e.processes, t.processes),
                arcs: c({}, e.arcs, t.arcs),
                meta: c({}, e.meta, t.meta)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.empty = n, t.merge = o;
        var c = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        };
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = 0, r = i;
            return r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]];
        }
        function o() {
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, n(e);
        }
        t.a = o;
        for (var c = new Array(16), s = function() {
            for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), 
            c[t] = e >>> ((3 & t) << 3) & 255;
            return c;
        }, i = [], a = {}, u = 0; u < 256; u++) i[u] = (u + 256).toString(16).substr(1), 
        a[i[u]] = u;
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: C,
                    processes: R,
                    arcs: w,
                    meta: M
                };
            }
            function t() {
                var e = {};
                for (var t in U.es) e[t] = U.es[t].val;
                return e;
            }
            function r() {
                return k;
            }
            function n(e) {
                k = e;
            }
            function s() {
                return M;
            }
            function i(e) {
                null == e || "object" != typeof e || e instanceof Array || (M = Object.assign({}, M, e));
            }
            function a(e) {
                L = e;
            }
            function u(e) {
                return U.es[e] && U.es[e].val;
            }
            function f(e, t) {
                var r = S(e);
                r.accept && !r.accept(t, r.val) || (r.val = t, I[e] = !0, G = !0, T());
            }
            function p(e, t) {
                f(e, t(u(e)));
            }
            function l(e, t) {
                S(e).cb = t;
            }
            function d(e) {
                delete S(e).cb;
            }
            function v(e) {
                var t = o.createEntity(e);
                C[t.id] = t;
                var r = S(t.id);
                return null != t.value && null == r.val && (r.val = t.value, I[t.id] = !1, G = !0), 
                r.accept = t.accept, t;
            }
            function y(e) {
                var t = S(e);
                for (var r in t.arcs) _(r);
                delete U.es[e], delete C[e];
            }
            function O(e) {
                var t = o.createProcess(e, k);
                R[t.id] = t;
                var r = x(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = w[e].port;
                    null == r || t.ports[r] && t.ports[r] !== o.PORT_TYPES.ACCUMULATOR || _(e);
                });
                for (var n in t.ports) t.ports[n] === o.PORT_TYPES.ACCUMULATOR && (r.acc = n);
                for (var c in r.arcs) m(w[c]);
                return t;
            }
            function h(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) _(r);
                delete U.ps[e], delete R[e];
            }
            function g(e) {
                var t = o.createArc(e);
                w[t.id] = t, m(t);
                var r = x(t.process), n = R[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && j(r), 
                t;
            }
            function _(e) {
                var t = w[e];
                if (t) {
                    var r = x(t.process), n = S(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete w[e];
            }
            function m(e) {
                var t = e.process, r = e.entity, n = x(t), c = S(r), s = R[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] == o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    c.accept && !c.accept(e, c.val) || (c.val = e, null != e && (I[c.id] = !0, G = !0), 
                    D || T());
                }));
            }
            function P(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) g(e.arcs[t]);
                e.meta && i(e.meta);
            }
            function T() {
                L && console.log("flushing graph recursively with", I);
                var e = Object.keys(I);
                if (G) {
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t];
                        if (I[r]) {
                            var n = U.es[r];
                            for (var o in n.reactions) b(n.reactions[o]);
                        }
                    }
                    var c = {};
                    I = {}, G = !1, D = !0;
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t], n = U.es[r];
                        n.cb && (Y[r] = n);
                        for (var o in n.effects) c[o] || (b(n.effects[o]), c[o] = !0);
                    }
                    if (D = !1, G) T(); else {
                        for (var r in Y) {
                            var n = Y[r];
                            n.cb(n.val);
                        }
                        Y = {}, L && console.log("flush finished");
                    }
                }
            }
            function b(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    e.values[r] = n.val;
                }
                if (t) if (L && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = R[e.id].procedure.apply(k, [ e.sink ].concat(e.values)); else {
                    var o = R[e.id].procedure.apply(k, e.values);
                    if (e.out) {
                        var c = e.out;
                        c.accept && !c.accept(o, c.val) || (c.val = o, null != o && (I[e.out.id] = null == e.acc, 
                        G = !0));
                    }
                }
            }
            function j(e) {
                e.async ? setTimeout(function() {
                    b(e);
                }, 10) : (b(e), e.out && (I[e.out.id] = !1, G = !0));
            }
            function A(e) {
                var t = x(e);
                b(t), t.async || T();
            }
            function E(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function S(e) {
                return C[e] || v({
                    id: e
                }), U.es[e] || (U.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function x(e) {
                return U.ps[e] || (U.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var C = {}, R = {}, w = {}, M = {}, k = null, U = {
                es: {},
                ps: {}
            }, L = !1, Y = {}, I = {}, D = !1, G = !1;
            return {
                addEntity: v,
                removeEntity: y,
                addProcess: O,
                removeProcess: h,
                addArc: g,
                removeArc: _,
                addGraph: P,
                getGraph: e,
                getState: t,
                setMeta: i,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: u,
                set: f,
                update: p,
                on: l,
                off: d,
                start: A,
                stop: E,
                flush: T,
                PORT_TYPES: c({}, o.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = r(0);
        t.create = n;
        var c = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        };
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            var t, o, c = e.value, i = r.i(O.a)(), a = 0, u = [], f = {};
            return f.HOT = {
                entity: f,
                type: y.PORT_TYPES.HOT
            }, f.COLD = {
                entity: f,
                type: y.PORT_TYPES.COLD
            }, f.id = function(e, r) {
                return i = n(e, r), t = r, f;
            }, f.val = function(e) {
                return c = e, f;
            }, f.accept = function(e) {
                return o = e, f;
            }, f.getId = function() {
                return i;
            }, e.procedure && u.push(e), f.react = function(e, t, r) {
                var n = s(e, t, r);
                n.pidSuffix = _ + a++;
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: f,
                    type: y.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), u.push(n), f;
            }, f.getGraph = function() {
                var e = v.empty();
                return e.entities[i] = r.i(y.createEntity)({
                    id: i,
                    value: c,
                    accept: o
                }), u.forEach(function(o) {
                    var c = o.processId ? n(o.processId, t) : i + o.pidSuffix, s = o.dependencies, a = [];
                    if (s) for (var u in s) {
                        var f = s[u];
                        if (a[u] = f.type, f.type !== y.PORT_TYPES.ACCUMULATOR) {
                            var p = r.i(y.createArc)({
                                process: c,
                                entity: f.entity.getId(),
                                port: u
                            });
                            e.arcs[p.id] = p;
                        }
                    }
                    var l = r.i(y.createArc)({
                        process: c,
                        entity: i
                    });
                    e.arcs[l.id] = l, e.processes[c] = r.i(y.createProcess)({
                        id: c,
                        ports: a,
                        procedure: o.procedure,
                        async: o.async,
                        autostart: o.autostart
                    });
                }), e;
            }, f;
        }
        function c(e) {
            return o({
                value: e
            });
        }
        function s(e, t, r) {
            if ("function" == typeof e) return {
                procedure: e,
                pidSuffix: g
            };
            if (Array.isArray(e) && "function" == typeof t) return {
                dependencies: e,
                procedure: t,
                pidSuffix: g
            };
            if ("string" == typeof e && "function" == typeof t) return {
                processId: e,
                procedure: t
            };
            if ("string" == typeof e && Array.isArray(t) && "function" == typeof r) return {
                processId: e,
                dependencies: t,
                procedure: r
            };
            throw TypeError("Wrong stream arguments");
        }
        function i(e, t, r) {
            return o(s(e, t, r));
        }
        function a(e, t, r) {
            return o(h({}, s(e, t, r), {
                async: !0
            }));
        }
        function u(e, t, r) {
            return o(h({}, s(e, t, r), {
                autostart: !0
            }));
        }
        function f(e, t, r) {
            return o(h({}, s(e, t, r), {
                async: !0,
                autostart: !0
            }));
        }
        function p(e) {
            return e && "function" == typeof e.id && "function" == typeof e.getGraph && e.HOT && e.COLD;
        }
        function l(e, t) {
            for (var r in e) {
                var n = e[r];
                p(n) && n.id(r, t);
            }
            return e;
        }
        function d(e) {
            var t = [];
            for (var r in e) {
                var n = e[r];
                p(n) && t.push(n);
            }
            return t.reduce(function(e, t) {
                return v.merge(e, t.getGraph());
            }, v.empty());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var v = r(1), y = r(0), O = r(2);
        t.val = c, t.stream = i, t.asyncStream = a, t.streamStart = u, t.asyncStreamStart = f, 
        t.isEntity = p, t.resolveEntityIds = l, t.getGraphFromAll = d;
        var h = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, g = "Stream", _ = "Reaction";
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval("(function(){ return " + code + "})");
            return factory.call(context);
        }
        __webpack_exports__.a = evaluate;
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(3), o = r(4), c = r(1), s = r(0);
        r.d(t, "runtime", function() {
            return i;
        }), r.d(t, "create", function() {
            return a;
        }), r.d(t, "types", function() {
            return u;
        }), r.d(t, "utils", function() {
            return f;
        }), t.default = n;
        var i = n, a = n.create, u = s, f = {
            entityRef: o,
            graph: c
        };
    } ]);
});