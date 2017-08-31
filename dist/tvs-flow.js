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
            var t = e.id, r = void 0 === t ? Object(s.a)() : t, n = e.value, o = e.json, c = e.accept, i = e.reset, u = e.meta;
            return null == n && o && (n = JSON.parse(o)), {
                id: r,
                value: n,
                accept: c,
                reset: i,
                meta: a({}, u)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? Object(s.a)() : r, o = e.ports, c = void 0 === o ? [] : o, f = e.procedure, l = e.code, p = e.autostart, d = void 0 !== p && p, v = e.async, y = void 0 !== v && v, O = e.delta, h = void 0 !== O && O, b = e.meta;
            if (null == f && null != l && (f = Object(i.a)(l, t)), null == f) throw TypeError("Process must have procedure or code set");
            return h && !c.length && c.push(u.HOT), {
                id: n,
                ports: c,
                procedure: f,
                autostart: d,
                async: y,
                delta: h,
                meta: a({}, b)
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
        }), t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return u;
        });
        var s = r(1), i = r(5), a = this && this.__assign || Object.assign || function(e) {
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
            var t = i, r = 0;
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
        }, i = [], a = {}, u = 0; u < 256; u++) i[u] = (u + 256).toString(16).substr(1), 
        a[i[u]] = u;
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
            return i;
        }), r.d(t, "create", function() {
            return a;
        }), r.d(t, "types", function() {
            return u;
        }), r.d(t, "utils", function() {
            return f;
        });
        var n = r(4), o = r(6), c = r(2), s = r(0);
        t.default = n;
        var i = n, a = n.create, u = s, f = {
            entityRef: o,
            graph: c
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: k,
                    processes: w,
                    arcs: M,
                    meta: L
                };
            }
            function t() {
                var e = {};
                for (var t in U.es) e[t] = U.es[t].val;
                return e;
            }
            function r() {
                return Y;
            }
            function n(e) {
                Y = e;
            }
            function s() {
                return L;
            }
            function i(e) {
                null == e || "object" != typeof e || e instanceof Array || (L = c({}, L, e));
            }
            function a(e) {
                H = e;
            }
            function u(e) {
                return U.es[e] && U.es[e].val;
            }
            function f(e, t) {
                E(C(e), t, !0) && P();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function p(e, t) {
                C(e).cb.push(t);
            }
            function d(e, t) {
                var r = C(e);
                r.cb = t ? r.cb.filter(function(e) {
                    return e !== t;
                }) : [];
            }
            function v(e) {
                var t = Object(o.createEntity)(e);
                k[t.id] = t;
                var r = C(t.id);
                return null == t.value || !t.reset && null != r.val || (r.val = t.value, I[t.id] = !1, 
                F = !0), r.accept = t.accept, t;
            }
            function y(e) {
                var t = C(e);
                for (var r in t.arcs) g(r);
                delete U.es[e], delete k[e];
            }
            function O(e) {
                var t = Object(o.createProcess)(e, Y), r = t.ports, n = R(t.id);
                w[t.id] = t, delete n.acc, n.values = [], n.sources = [], n.async = t.async, n.delta = t.delta, 
                Object.keys(n.arcs).forEach(function(e) {
                    var t = M[e].port;
                    null == t || r[t] && r[t] !== o.PORT_TYPES.ACCUMULATOR || g(e);
                }), r.forEach(function(e, t) {
                    e === o.PORT_TYPES.ACCUMULATOR && (n.acc = t);
                });
                for (var c in n.arcs) _(M[c]);
                return t;
            }
            function h(e) {
                var t = R(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) g(r);
                delete U.ps[e], delete w[e];
            }
            function b(e) {
                var t = Object(o.createArc)(e);
                M[t.id] = t, _(t);
                var r = R(t.process), n = w[t.process];
                return n && !0 === n.autostart && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && x(r), 
                t;
            }
            function g(e) {
                var t = M[e];
                if (t) {
                    var r = R(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete M[e];
            }
            function _(e) {
                var t = e.process, r = e.entity, n = R(t), c = C(r), s = w[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] === o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    E(c, e, !0) && !D && P();
                }));
            }
            function j(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) b(e.arcs[t]);
                i(e.meta);
            }
            function m(e) {
                var t = {}, r = {};
                if (e.entities) for (var n in e.entities) {
                    var o = e.entities[n];
                    o.id && (t[o.id] = !0);
                }
                if (e.processes) for (var n in e.processes) {
                    var c = e.processes[n];
                    c.id && (r[c.id] = !0);
                }
                Object.keys(k).filter(function(e) {
                    return !t[e];
                }).forEach(y), Object.keys(w).filter(function(e) {
                    return !r[e];
                }).forEach(h), j(e);
            }
            function P() {
                H && console.log("flushing graph recursively with", I);
                for (var e = Object.keys(I), t = 0, r = e; t < r.length; t++) {
                    var n = r[t];
                    if (I[n]) {
                        var o = U.es[n];
                        for (var c in o.reactions) T(o.reactions[c]);
                    }
                }
                var s = {};
                I = {}, F = !1, D = !0;
                for (var i = 0, a = e; i < a.length; i++) {
                    var n = a[i], o = U.es[n];
                    o.cb.length > 0 && (G[n] = o);
                    for (var c in o.effects) s[c] || (T(o.effects[c]), s[c] = !0);
                }
                if (D = !1, F) P(); else {
                    var u = Object.keys(G);
                    G = {};
                    for (var f in u) for (var o = U.es[u[f]], l = 0, p = o.cb; l < p.length; l++) {
                        var d = p[l];
                        d(o.val);
                    }
                    H && console.log("flush finished");
                }
            }
            function T(e) {
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
                if (t) if (H && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = w[e.id].procedure.apply(Y, [ e.sink ].concat(e.values)); else {
                    var o = w[e.id].procedure.apply(Y, e.values);
                    e.out && E(e.out, o, null == e.acc);
                }
            }
            function E(e, t, r) {
                return !(e.accept && !e.accept(t, e.val)) && (e.oldVal = e.val, e.val = t, null != t && (I[e.id] = r, 
                F = !0), !0);
            }
            function x(e) {
                e.async ? requestAnimationFrame(function() {
                    T(e);
                }) : (T(e), e.out && (I[e.out.id] = !1));
            }
            function A(e) {
                var t = R(e);
                T(t), t.async || P();
            }
            function S(e) {
                var t = R(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function C(e) {
                return k[e] || v({
                    id: e
                }), U.es[e] || (U.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {},
                    cb: []
                });
            }
            function R(e) {
                return U.ps[e] || (U.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var k = {}, w = {}, M = {}, U = {
                es: {},
                ps: {}
            }, L = {}, Y = null, H = !1, G = {}, I = {}, D = !1, F = !1;
            return {
                addEntity: v,
                removeEntity: y,
                addProcess: O,
                removeProcess: h,
                addArc: b,
                removeArc: g,
                addGraph: j,
                replaceGraph: m,
                getGraph: e,
                getState: t,
                setMeta: i,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: u,
                set: f,
                update: l,
                on: p,
                off: d,
                start: A,
                stop: S,
                flush: P,
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
            var t, r, o, c = e.value, i = Object(p.a)(), a = [], u = {};
            return u.HOT = {
                entity: u,
                type: l.PORT_TYPES.HOT
            }, u.COLD = {
                entity: u,
                type: l.PORT_TYPES.COLD
            }, u.id = function(e, r) {
                return i = n(e, r), t = r, u;
            }, u.val = function(e) {
                return c = e, u;
            }, u.updateVal = function(e) {
                return c = e(c), u;
            }, u.accept = function(e) {
                return r = e, u;
            }, u.reset = function() {
                return o = !0, u;
            }, u.getId = function() {
                return i;
            }, e.procedure && a.push(e), u.react = function(e, t, r) {
                var n = s(e, t, r);
                n.pidSuffix = y;
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: u,
                    type: l.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), a.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[i] = Object(l.createEntity)({
                    id: i,
                    value: c,
                    accept: r,
                    reset: o
                }), a.forEach(function(r) {
                    var o = r.dependencies, c = r.processId ? n(r.processId, t) : i + r.pidSuffix + (o && o.length ? ":" + o.reduce(function(e, t) {
                        var r = t.entity.getId();
                        return r === i ? e : e + ":" + r;
                    }, "") : ""), s = [];
                    o && o.forEach(function(t, r) {
                        if (s[r] = t.type, t.type !== l.PORT_TYPES.ACCUMULATOR) {
                            var n = Object(l.createArc)({
                                process: c,
                                entity: t.entity.getId(),
                                port: r
                            });
                            e.arcs[n.id] = n;
                        }
                    });
                    var a = Object(l.createArc)({
                        process: c,
                        entity: i
                    });
                    e.arcs[a.id] = a, e.processes[c] = Object(l.createProcess)({
                        id: c,
                        ports: s,
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
        function s(e, t, r) {
            var n = {
                procedure: t
            };
            return null != e && (n.dependencies = e), "string" == typeof r ? n.processId = r : n.pidSuffix = v, 
            n;
        }
        function i(e) {
            return e && "function" == typeof e.id && "function" == typeof e.getGraph && e.HOT && e.COLD;
        }
        function a(e, t) {
            for (var r in e) {
                var n = e[r];
                i(n) && n.id(r, t);
            }
            return e;
        }
        function u(e) {
            var t = [];
            for (var r in e) {
                var n = e[r];
                i(n) && t.push(n);
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
            return _;
        }), t.isEntity = i, t.resolveEntityIds = a, t.getGraphFromAll = u;
        var f = r(2), l = r(0), p = r(1), d = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, v = "Stream", y = "Reaction", O = function(e, t, r) {
            return o(s(e, t, r));
        }, h = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0
            }));
        }, b = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                autostart: !0
            }));
        }, g = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0,
                autostart: !0
            }));
        }, _ = function(e, t, r) {
            return o(d({}, s([ e.HOT ], t, r), {
                delta: !0
            }));
        };
    } ]);
});