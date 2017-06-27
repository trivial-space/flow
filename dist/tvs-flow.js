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
            var r = e.id, n = void 0 === r ? s.a() : r, o = e.ports, c = void 0 === o ? [] : o, u = e.procedure, f = e.code, p = e.autostart, l = void 0 !== p && p, d = e.async, v = void 0 !== d && d, y = e.meta;
            if (null == u && null != f && (u = a.a(f, t)), null == u) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: c,
                procedure: u,
                autostart: l,
                async: v,
                meta: i({}, y)
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
                    entities: C,
                    processes: R,
                    arcs: w,
                    meta: k
                };
            }
            function t() {
                var e = {};
                for (var t in M.es) e[t] = M.es[t].val;
                return e;
            }
            function r() {
                return U;
            }
            function n(e) {
                U = e;
            }
            function s() {
                return k;
            }
            function a(e) {
                null == e || "object" != typeof e || e instanceof Array || (k = c({}, k, e));
            }
            function i(e) {
                L = e;
            }
            function u(e) {
                return M.es[e] && M.es[e].val;
            }
            function f(e, t) {
                var r = A(e);
                r.accept && !r.accept(t, r.val) || (r.val = t, I[e] = !0, G = !0, P());
            }
            function p(e, t) {
                f(e, t(u(e)));
            }
            function l(e, t) {
                A(e).cb.push(t);
            }
            function d(e, t) {
                var r = A(e);
                r.cb = t ? r.cb.filter(function(e) {
                    return e !== t;
                }) : [];
            }
            function v(e) {
                var t = o.createEntity(e);
                C[t.id] = t;
                var r = A(t.id);
                return null == t.value || !t.reset && null != r.val || (r.val = t.value, I[t.id] = !1, 
                G = !0), r.accept = t.accept, t;
            }
            function y(e) {
                var t = A(e);
                for (var r in t.arcs) _(r);
                delete M.es[e], delete C[e];
            }
            function h(e) {
                var t = o.createProcess(e, U);
                R[t.id] = t;
                var r = S(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = w[e].port;
                    null == r || t.ports[r] && t.ports[r] !== o.PORT_TYPES.ACCUMULATOR || _(e);
                }), t.ports.forEach(function(e, t) {
                    e === o.PORT_TYPES.ACCUMULATOR && (r.acc = t);
                });
                for (var n in r.arcs) b(w[n]);
                return t;
            }
            function O(e) {
                var t = S(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) _(r);
                delete M.ps[e], delete R[e];
            }
            function g(e) {
                var t = o.createArc(e);
                w[t.id] = t, b(t);
                var r = S(t.process), n = R[t.process];
                return n && !0 === n.autostart && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && j(r), 
                t;
            }
            function _(e) {
                var t = w[e];
                if (t) {
                    var r = S(t.process), n = A(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete w[e];
            }
            function b(e) {
                var t = e.process, r = e.entity, n = S(t), c = A(r), s = R[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] === o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    c.accept && !c.accept(e, c.val) || (c.val = e, null != e && (I[c.id] = !0, G = !0), 
                    D || P());
                }));
            }
            function m(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var t in e.processes) h(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) g(e.arcs[t]);
                e.meta && a(e.meta);
            }
            function P() {
                L && console.log("flushing graph recursively with", I);
                var e = Object.keys(I);
                if (G) {
                    for (var t = 0, r = e; t < r.length; t++) {
                        var n = r[t];
                        if (I[n]) {
                            var o = M.es[n];
                            for (var c in o.reactions) T(o.reactions[c]);
                        }
                    }
                    var s = {};
                    I = {}, G = !1, D = !0;
                    for (var a = 0, i = e; a < i.length; a++) {
                        var n = i[a], o = M.es[n];
                        o.cb.length > 0 && (Y[n] = o);
                        for (var c in o.effects) s[c] || (T(o.effects[c]), s[c] = !0);
                    }
                    if (D = !1, G) P(); else {
                        var u = Object.keys(Y);
                        Y = {};
                        for (var f in u) for (var o = M.es[u[f]], p = 0, l = o.cb; p < l.length; p++) {
                            var d = l[p];
                            d(o.val);
                        }
                        L && console.log("flush finished");
                    }
                }
            }
            function T(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    e.values[r] = n.val;
                }
                if (t) if (L && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = R[e.id].procedure.apply(U, [ e.sink ].concat(e.values)); else {
                    var o = R[e.id].procedure.apply(U, e.values);
                    if (e.out) {
                        var c = e.out;
                        c.accept && !c.accept(o, c.val) || (c.val = o, null != o && (I[e.out.id] = null == e.acc, 
                        G = !0));
                    }
                }
            }
            function j(e) {
                e.async ? setTimeout(function() {
                    T(e);
                }, 10) : (T(e), e.out && (I[e.out.id] = !1, G = !0));
            }
            function E(e) {
                var t = S(e);
                T(t), t.async || P();
            }
            function x(e) {
                var t = S(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function A(e) {
                return C[e] || v({
                    id: e
                }), M.es[e] || (M.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {},
                    cb: []
                });
            }
            function S(e) {
                return M.ps[e] || (M.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var C = {}, R = {}, w = {}, M = {
                es: {},
                ps: {}
            }, k = {}, U = null, L = !1, Y = {}, I = {}, D = !1, G = !1;
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
                update: p,
                on: l,
                off: d,
                start: E,
                stop: x,
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
            var t, r, o, c = e.value, a = l.a(), i = [], u = {};
            return u.HOT = {
                entity: u,
                type: p.PORT_TYPES.HOT
            }, u.COLD = {
                entity: u,
                type: p.PORT_TYPES.COLD
            }, u.id = function(e, r) {
                return a = n(e, r), t = r, u;
            }, u.val = function(e) {
                return c = e, u;
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
                    type: p.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), i.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[a] = p.createEntity({
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
                        if (s[r] = t.type, t.type !== p.PORT_TYPES.ACCUMULATOR) {
                            var n = p.createArc({
                                process: c,
                                entity: t.entity.getId(),
                                port: r
                            });
                            e.arcs[n.id] = n;
                        }
                    });
                    var i = p.createArc({
                        process: c,
                        entity: a
                    });
                    e.arcs[i.id] = i, e.processes[c] = p.createProcess({
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
        var f = r(2), p = r(0), l = r(1), d = this && this.__assign || Object.assign || function(e) {
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