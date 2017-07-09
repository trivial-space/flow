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
        return t.m = e, t.c = r, t.d = function(e, r, n) {
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
        }, t.p = "", t(t.s = 3);
    }([ function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? s.a() : t, n = e.value, o = e.json, c = e.accept, a = e.reset, u = e.meta;
            return null == n && o && (n = JSON.parse(o)), {
                id: r,
                value: n,
                accept: c,
                reset: a,
                meta: i({}, u)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? s.a() : r, o = e.ports, c = void 0 === o ? [] : o, f = e.procedure, l = e.code, p = e.autostart, d = void 0 !== p && p, v = e.async, y = void 0 !== v && v, h = e.delta, O = void 0 !== h && h, g = e.meta;
            if (null == f && null != l && (f = a.a(l, t)), null == f) throw TypeError("Process must have procedure or code set");
            return O && !c.length && c.push(u.HOT), {
                id: n,
                ports: c,
                procedure: f,
                autostart: d,
                async: y,
                delta: O,
                meta: i({}, g)
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
                meta: i({}, c)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return u;
        });
        var s = r(1), a = r(5), i = this && this.__assign || Object.assign || function(e) {
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
        function n(e) {
            var t = a, r = 0;
            return t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]];
        }
        function o() {
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, n(e);
        }
        t.a = o;
        for (var c = new Array(16), s = function() {
            for (var e = 0, t = void 0; e < 16; e++) 0 == (3 & e) && (t = 4294967296 * Math.random(), 
            c[e] = t >>> ((3 & e) << 3) & 255);
            return c;
        }, a = [], i = {}, u = 0; u < 256; u++) a[u] = (u + 256).toString(16).substr(1), 
        i[a[u]] = u;
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
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), r.d(t, "runtime", function() {
            return a;
        }), r.d(t, "create", function() {
            return i;
        }), r.d(t, "types", function() {
            return u;
        }), r.d(t, "utils", function() {
            return f;
        });
        var n = r(4), o = r(6), c = r(2), s = r(0);
        t.default = n;
        var a = n, i = n.create, u = s, f = {
            entityRef: o,
            graph: c
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: R,
                    processes: w,
                    arcs: M,
                    meta: U
                };
            }
            function t() {
                var e = {};
                for (var t in k.es) e[t] = k.es[t].val;
                return e;
            }
            function r() {
                return L;
            }
            function n(e) {
                L = e;
            }
            function s() {
                return U;
            }
            function a(e) {
                null == e || "object" != typeof e || e instanceof Array || (U = c({}, U, e));
            }
            function i(e) {
                Y = e;
            }
            function u(e) {
                return k.es[e] && k.es[e].val;
            }
            function f(e, t) {
                P(S(e), t, !0) && T();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function p(e, t) {
                S(e).cb.push(t);
            }
            function d(e, t) {
                var r = S(e);
                r.cb = t ? r.cb.filter(function(e) {
                    return e !== t;
                }) : [];
            }
            function v(e) {
                var t = o.createEntity(e);
                R[t.id] = t;
                var r = S(t.id);
                return null == t.value || !t.reset && null != r.val || (r.val = t.value, I[t.id] = !1, 
                G = !0), r.accept = t.accept, t;
            }
            function y(e) {
                var t = S(e);
                for (var r in t.arcs) _(r);
                delete k.es[e], delete R[e];
            }
            function h(e) {
                var t = o.createProcess(e, L), r = t.ports, n = C(t.id);
                w[t.id] = t, delete n.acc, n.values = [], n.sources = [], n.async = t.async, n.delta = t.delta, 
                Object.keys(n.arcs).forEach(function(e) {
                    var t = M[e].port;
                    null == t || r[t] && r[t] !== o.PORT_TYPES.ACCUMULATOR || _(e);
                }), r.forEach(function(e, t) {
                    e === o.PORT_TYPES.ACCUMULATOR && (n.acc = t);
                });
                for (var c in n.arcs) b(M[c]);
                return t;
            }
            function O(e) {
                var t = C(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) _(r);
                delete k.ps[e], delete w[e];
            }
            function g(e) {
                var t = o.createArc(e);
                M[t.id] = t, b(t);
                var r = C(t.process), n = w[t.process];
                return n && !0 === n.autostart && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && E(r), 
                t;
            }
            function _(e) {
                var t = M[e];
                if (t) {
                    var r = C(t.process), n = S(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete M[e];
            }
            function b(e) {
                var t = e.process, r = e.entity, n = C(t), c = S(r), s = w[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] === o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    P(c, e, !0) && !D && T();
                }));
            }
            function m(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var t in e.processes) h(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) g(e.arcs[t]);
                e.meta && a(e.meta);
            }
            function P(e, t, r) {
                return !(e.accept && !e.accept(t, e.val)) && (e.oldVal = e.val, e.val = t, null != t && (I[e.id] = r, 
                G = !0), !0);
            }
            function T() {
                Y && console.log("flushing graph recursively with", I);
                var e = Object.keys(I);
                if (G) {
                    for (var t = 0, r = e; t < r.length; t++) {
                        var n = r[t];
                        if (I[n]) {
                            var o = k.es[n];
                            for (var c in o.reactions) j(o.reactions[c]);
                        }
                    }
                    var s = {};
                    I = {}, G = !1, D = !0;
                    for (var a = 0, i = e; a < i.length; a++) {
                        var n = i[a], o = k.es[n];
                        o.cb.length > 0 && (H[n] = o);
                        for (var c in o.effects) s[c] || (j(o.effects[c]), s[c] = !0);
                    }
                    if (D = !1, G) T(); else {
                        var u = Object.keys(H);
                        H = {};
                        for (var f in u) for (var o = k.es[u[f]], l = 0, p = o.cb; l < p.length; l++) {
                            var d = p[l];
                            d(o.val);
                        }
                        Y && console.log("flush finished");
                    }
                }
            }
            function j(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    if (e.delta && null == n.oldVal) {
                        t = !1;
                        break;
                    }
                    e.values[r] = n.val, e.delta && (e.values[r + 1] = n.oldVal);
                }
                if (t) if (Y && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = w[e.id].procedure.apply(L, [ e.sink ].concat(e.values)); else {
                    var o = w[e.id].procedure.apply(L, e.values);
                    e.out && P(e.out, o, null == e.acc);
                }
            }
            function E(e) {
                e.async ? setTimeout(function() {
                    j(e);
                }, 10) : (j(e), e.out && (I[e.out.id] = !1));
            }
            function x(e) {
                var t = C(e);
                j(t), t.async || T();
            }
            function A(e) {
                var t = C(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function S(e) {
                return R[e] || v({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {},
                    cb: []
                });
            }
            function C(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var R = {}, w = {}, M = {}, k = {
                es: {},
                ps: {}
            }, U = {}, L = null, Y = !1, H = {}, I = {}, D = !1, G = !1;
            return {
                addEntity: v,
                removeEntity: y,
                addProcess: h,
                removeProcess: O,
                addArc: g,
                removeArc: _,
                addGraph: m,
                getGraph: e,
                getState: t,
                setMeta: a,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: i,
                get: u,
                set: f,
                update: l,
                on: p,
                off: d,
                start: x,
                stop: A,
                flush: T,
                PORT_TYPES: c({}, o.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = n;
        var o = r(0), c = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        };
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        __webpack_exports__.a = evaluate;
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            var t, r, o, c = e.value, a = p.a(), i = [], u = {};
            return u.HOT = {
                entity: u,
                type: l.PORT_TYPES.HOT
            }, u.COLD = {
                entity: u,
                type: l.PORT_TYPES.COLD
            }, u.id = function(e, r) {
                return a = n(e, r), t = r, u;
            }, u.val = function(e) {
                return c = e, u;
            }, u.updateVal = function(e) {
                return c = e(c), u;
            }, u.accept = function(e) {
                return r = e, u;
            }, u.reset = function() {
                return o = !0, u;
            }, u.getId = function() {
                return a;
            }, e.procedure && i.push(e), u.react = function(e, t, r) {
                var n = s(e, t, r);
                n.pidSuffix = y;
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: u,
                    type: l.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), i.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[a] = l.createEntity({
                    id: a,
                    value: c,
                    accept: r,
                    reset: o
                }), i.forEach(function(r) {
                    var o = r.dependencies, c = r.processId ? n(r.processId, t) : a + r.pidSuffix + (o && o.length ? ":" + o.reduce(function(e, t) {
                        var r = t.entity.getId();
                        return r === a ? e : e + ":" + r;
                    }, "") : ""), s = [];
                    o && o.forEach(function(t, r) {
                        if (s[r] = t.type, t.type !== l.PORT_TYPES.ACCUMULATOR) {
                            var n = l.createArc({
                                process: c,
                                entity: t.entity.getId(),
                                port: r
                            });
                            e.arcs[n.id] = n;
                        }
                    });
                    var i = l.createArc({
                        process: c,
                        entity: a
                    });
                    e.arcs[i.id] = i, e.processes[c] = l.createProcess({
                        id: c,
                        ports: s,
                        procedure: r.procedure,
                        async: r.async,
                        autostart: r.autostart
                    });
                }), e;
            }, u;
        }
        function c(e) {
            return o({
                value: e
            });
        }
        function s(e, t, r) {
            var n = {
                procedure: t
            };
            return null != e && (n.dependencies = e), "string" == typeof r ? n.processId = r : n.pidSuffix = v, 
            n;
        }
        function a(e) {
            return e && "function" == typeof e.id && "function" == typeof e.getGraph && e.HOT && e.COLD;
        }
        function i(e, t) {
            for (var r in e) {
                var n = e[r];
                a(n) && n.id(r, t);
            }
            return e;
        }
        function u(e) {
            var t = [];
            for (var r in e) {
                var n = e[r];
                a(n) && t.push(n);
            }
            return t.reduce(function(e, t) {
                return f.merge(e, t.getGraph());
            }, f.empty());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.val = c, r.d(t, "stream", function() {
            return h;
        }), r.d(t, "asyncStream", function() {
            return O;
        }), r.d(t, "streamStart", function() {
            return g;
        }), r.d(t, "asyncStreamStart", function() {
            return _;
        }), t.isEntity = a, t.resolveEntityIds = i, t.getGraphFromAll = u;
        var f = r(2), l = r(0), p = r(1), d = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, v = "Stream", y = "Reaction", h = function(e, t, r) {
            return o(s(e, t, r));
        }, O = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0
            }));
        }, g = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                autostart: !0
            }));
        }, _ = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0,
                autostart: !0
            }));
        };
    } ]);
});