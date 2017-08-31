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
            var t = e.id, r = void 0 === t ? Object(a.a)() : t, n = e.value, o = e.json, c = e.accept, s = e.reset, i = e.meta;
            return null == n && o && (n = JSON.parse(o)), {
                id: r,
                value: n,
                accept: c,
                reset: s,
                meta: i
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? Object(a.a)() : r, o = e.ports, c = void 0 === o ? [] : o, u = e.procedure, f = e.code, l = e.autostart, p = void 0 !== l && l, d = e.async, v = void 0 !== d && d, y = e.delta, O = void 0 !== y && y, h = e.meta;
            if (null == u && null != f && (u = Object(s.a)(f, t)), null == u) throw TypeError("Process must have procedure or code set");
            return O && !c.length && c.push(i.HOT), {
                id: n,
                ports: c,
                procedure: u,
                autostart: p,
                async: v,
                delta: O,
                meta: h
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
                meta: c
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return i;
        });
        var a = r(1), s = r(5), i = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = s, r = 0;
            return t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + "-" + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]] + t[e[r++]];
        }
        function o() {
            var e = a();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, n(e);
        }
        t.a = o;
        for (var c = new Array(16), a = function() {
            for (var e = 0, t = void 0; e < 16; e++) 0 == (3 & e) && (t = 4294967296 * Math.random(), 
            c[e] = t >>> ((3 & e) << 3) & 255);
            return c;
        }, s = [], i = {}, u = 0; u < 256; u++) s[u] = (u + 256).toString(16).substr(1), 
        i[s[u]] = u;
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
            return s;
        }), r.d(t, "create", function() {
            return i;
        }), r.d(t, "types", function() {
            return u;
        }), r.d(t, "utils", function() {
            return f;
        });
        var n = r(4), o = r(7), c = r(2), a = r(0);
        t.default = n;
        var s = n, i = n.create, u = a, f = {
            entityRef: o,
            graph: c
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: w,
                    processes: M,
                    arcs: U,
                    meta: Y
                };
            }
            function t() {
                var e = {};
                for (var t in L.es) e[t] = L.es[t].val;
                return e;
            }
            function r() {
                return H;
            }
            function n(e) {
                H = e;
            }
            function s() {
                return Y;
            }
            function i(e) {
                null == e || "object" != typeof e || Array.isArray(e) || (Y = Object(c.a)(Y, e));
            }
            function u(e) {
                G = e;
            }
            function f(e) {
                return L.es[e] && L.es[e].val;
            }
            function l(e, t) {
                E(R(e), t, !0) && T();
            }
            function p(e, t) {
                l(e, t(f(e)));
            }
            function d(e, t) {
                R(e).cb.push(t);
            }
            function v(e, t) {
                var r = R(e);
                r.cb = t ? r.cb.filter(function(e) {
                    return e !== t;
                }) : [];
            }
            function y(e) {
                var t = Object(o.createEntity)(e);
                w[t.id] = t;
                var r = R(t.id);
                return null == t.value || !t.reset && null != r.val || (r.val = t.value, D[t.id] = !1, 
                V = !0), r.accept = t.accept, t.meta && i({
                    entities: (n = {}, n[t.id] = t.meta, n)
                }), t;
                var n;
            }
            function O(e) {
                var t = R(e);
                for (var r in t.arcs) m(r);
                var n = w[e];
                n && n.meta && i({
                    entities: (o = {}, o[n.id] = void 0, o)
                }), delete L.es[e], delete w[e];
                var o;
            }
            function h(e) {
                var t = Object(o.createProcess)(e, H), r = t.ports, n = k(t.id);
                M[t.id] = t, delete n.acc, n.values = [], n.sources = [], n.async = t.async, n.delta = t.delta, 
                Object.keys(n.arcs).forEach(function(e) {
                    var t = U[e].port;
                    null == t || r[t] && r[t] !== o.PORT_TYPES.ACCUMULATOR || m(e);
                }), r.forEach(function(e, t) {
                    e === o.PORT_TYPES.ACCUMULATOR && (n.acc = t);
                });
                for (var c in n.arcs) _(U[c]);
                return t.meta && i({
                    processes: (a = {}, a[t.id] = t.meta, a)
                }), t;
                var a;
            }
            function b(e) {
                var t = k(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) m(r);
                delete L.ps[e];
                var n = M[e];
                n && n.meta && i({
                    processes: (o = {}, o[n.id] = void 0, o)
                }), delete M[e];
                var o;
            }
            function g(e) {
                var t = Object(o.createArc)(e);
                U[t.id] = t, _(t);
                var r = k(t.process), n = M[t.process];
                return n && !0 === n.autostart && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && x(r), 
                t.meta && i({
                    arcs: (c = {}, c[t.id] = t.meta, c)
                }), t;
                var c;
            }
            function m(e) {
                var t = U[e];
                if (t) {
                    var r = k(t.process), n = R(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]), t.meta && i({
                        arcs: (o = {}, o[t.id] = void 0, o)
                    });
                }
                delete U[e];
                var o;
            }
            function _(e) {
                var t = e.process, r = e.entity, n = k(t), c = R(r), a = M[t];
                c.arcs[e.id] = !0, a && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                a.ports && null != a.ports[e.port] && (n.sources[e.port] = c, a.ports[e.port] === o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    E(c, e, !0) && !F && T();
                }));
            }
            function j(e) {
                if (e.entities) for (var t in e.entities) y(e.entities[t]);
                if (e.processes) for (var t in e.processes) h(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) g(e.arcs[t]);
                i(e.meta);
            }
            function P(e) {
                var t = {}, r = {};
                if (e.entities) for (var n in e.entities) {
                    var o = e.entities[n];
                    o.id && (t[o.id] = !0);
                }
                if (e.processes) for (var n in e.processes) {
                    var c = e.processes[n];
                    c.id && (r[c.id] = !0);
                }
                Object.keys(w).filter(function(e) {
                    return !t[e];
                }).forEach(O), Object.keys(M).filter(function(e) {
                    return !r[e];
                }).forEach(b), j(e);
            }
            function T() {
                G && console.log("flushing graph recursively with", D);
                for (var e = Object.keys(D), t = 0, r = e; t < r.length; t++) {
                    var n = r[t];
                    if (D[n]) {
                        var o = L.es[n];
                        for (var c in o.reactions) A(o.reactions[c]);
                    }
                }
                var a = {};
                D = {}, V = !1, F = !0;
                for (var s = 0, i = e; s < i.length; s++) {
                    var n = i[s], o = L.es[n];
                    o.cb.length > 0 && (I[n] = o);
                    for (var c in o.effects) a[c] || (A(o.effects[c]), a[c] = !0);
                }
                if (F = !1, V) T(); else {
                    var u = Object.keys(I);
                    I = {};
                    for (var f in u) for (var o = L.es[u[f]], l = 0, p = o.cb; l < p.length; l++) {
                        var d = p[l];
                        d(o.val);
                    }
                    G && console.log("flush finished");
                }
            }
            function A(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    if (e.values[r] = n.val, e.delta) {
                        if (null == n.oldVal) {
                            t = !1;
                            break;
                        }
                        e.values[r + 1] = n.oldVal;
                    }
                }
                if (t) if (G && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = M[e.id].procedure.apply(H, [ e.sink ].concat(e.values)); else {
                    var o = M[e.id].procedure.apply(H, e.values);
                    e.out && E(e.out, o, null == e.acc);
                }
            }
            function E(e, t, r) {
                return !(e.accept && !e.accept(t, e.val)) && (e.oldVal = e.val, e.val = t, null != t && (D[e.id] = r, 
                V = !0), !0);
            }
            function x(e) {
                e.async ? requestAnimationFrame(function() {
                    A(e);
                }) : (A(e), e.out && (D[e.out.id] = !1));
            }
            function S(e) {
                var t = k(e);
                A(t), t.async || T();
            }
            function C(e) {
                var t = k(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function R(e) {
                return w[e] || y({
                    id: e
                }), L.es[e] || (L.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {},
                    cb: []
                });
            }
            function k(e) {
                return L.ps[e] || (L.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var w = {}, M = {}, U = {}, L = {
                es: {},
                ps: {}
            }, Y = {}, H = null, G = !1, I = {}, D = {}, F = !1, V = !1;
            return {
                addEntity: y,
                removeEntity: O,
                addProcess: h,
                removeProcess: b,
                addArc: g,
                removeArc: m,
                addGraph: j,
                replaceGraph: P,
                getGraph: e,
                getState: t,
                setMeta: i,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: u,
                get: f,
                set: l,
                update: p,
                on: d,
                off: v,
                start: S,
                stop: C,
                flush: T,
                PORT_TYPES: a({}, o.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = n;
        var o = r(0), c = r(6), a = this && this.__assign || Object.assign || function(e) {
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
            if ("object" == typeof e && "object" == typeof t && !Array.isArray(e) && !Array.isArray(t)) {
                var r = o({}, e);
                for (var c in t) {
                    var a = e[c], s = t[c];
                    void 0 !== s ? r[c] = n(a, s) : delete r[c];
                }
                return r;
            }
            return t;
        }
        t.a = n;
        var o = this && this.__assign || Object.assign || function(e) {
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
            var t, r, o, c = e.value, s = Object(p.a)(), i = [], u = {};
            return u.HOT = {
                entity: u,
                type: l.PORT_TYPES.HOT
            }, u.COLD = {
                entity: u,
                type: l.PORT_TYPES.COLD
            }, u.id = function(e, r) {
                return s = n(e, r), t = r, u;
            }, u.val = function(e) {
                return c = e, u;
            }, u.updateVal = function(e) {
                return c = e(c), u;
            }, u.accept = function(e) {
                return r = e, u;
            }, u.reset = function() {
                return o = !0, u;
            }, u.getId = function() {
                return s;
            }, e.procedure && i.push(e), u.react = function(e, t, r) {
                var n = a(e, t, r);
                n.pidSuffix = y;
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: u,
                    type: l.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), i.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[s] = Object(l.createEntity)({
                    id: s,
                    value: c,
                    accept: r,
                    reset: o
                }), i.forEach(function(r) {
                    var o = r.dependencies, c = r.processId ? n(r.processId, t) : s + r.pidSuffix + (o && o.length ? ":" + o.reduce(function(e, t) {
                        var r = t.entity.getId();
                        return r === s ? e : e + ":" + r;
                    }, "") : ""), a = [];
                    o && o.forEach(function(t, r) {
                        if (a[r] = t.type, t.type !== l.PORT_TYPES.ACCUMULATOR) {
                            var n = Object(l.createArc)({
                                process: c,
                                entity: t.entity.getId(),
                                port: r
                            });
                            e.arcs[n.id] = n;
                        }
                    });
                    var i = Object(l.createArc)({
                        process: c,
                        entity: s
                    });
                    e.arcs[i.id] = i, e.processes[c] = Object(l.createProcess)({
                        id: c,
                        ports: a,
                        procedure: r.procedure,
                        async: r.async,
                        autostart: r.autostart,
                        delta: r.delta
                    });
                }), e;
            }, u;
        }
        function c(e) {
            return o({
                value: e
            });
        }
        function a(e, t, r) {
            var n = {
                procedure: t
            };
            return null != e && (n.dependencies = e), "string" == typeof r ? n.processId = r : n.pidSuffix = v, 
            n;
        }
        function s(e) {
            return e && "function" == typeof e.id && "function" == typeof e.getGraph && e.HOT && e.COLD;
        }
        function i(e, t) {
            for (var r in e) {
                var n = e[r];
                s(n) && n.id(r, t);
            }
            return e;
        }
        function u(e) {
            var t = [];
            for (var r in e) {
                var n = e[r];
                s(n) && t.push(n);
            }
            return t.reduce(function(e, t) {
                return f.merge(e, t.getGraph());
            }, f.empty());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.val = c, r.d(t, "stream", function() {
            return O;
        }), r.d(t, "asyncStream", function() {
            return h;
        }), r.d(t, "streamStart", function() {
            return b;
        }), r.d(t, "asyncStreamStart", function() {
            return g;
        }), r.d(t, "delta", function() {
            return m;
        }), t.isEntity = s, t.resolveEntityIds = i, t.getGraphFromAll = u;
        var f = r(2), l = r(0), p = r(1), d = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, v = "Stream", y = "Reaction", O = function(e, t, r) {
            return o(a(e, t, r));
        }, h = function(e, t, r) {
            return o(d({}, a(e, t, r), {
                async: !0
            }));
        }, b = function(e, t, r) {
            return o(d({}, a(e, t, r), {
                autostart: !0
            }));
        }, g = function(e, t, r) {
            return o(d({}, a(e, t, r), {
                async: !0,
                autostart: !0
            }));
        }, m = function(e, t, r) {
            return o(d({}, a([ e.HOT ], t, r), {
                delta: !0
            }));
        };
    } ]);
});