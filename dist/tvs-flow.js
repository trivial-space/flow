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
            var t = e.id, n = void 0 === t ? r.i(s.a)() : t, o = e.value, c = e.json, a = e.accept, u = e.meta;
            return null == o && c && (o = JSON.parse(c)), {
                id: n,
                value: o,
                accept: a,
                meta: i({}, u)
            };
        }
        function o(e, t) {
            var n = e.id, o = void 0 === n ? r.i(s.a)() : n, c = e.ports, u = void 0 === c ? [] : c, f = e.procedure, p = e.code, l = e.autostart, d = void 0 !== l && l, v = e.async, y = void 0 !== v && v, O = e.meta;
            if (null == f && null != p && (f = r.i(a.a)(p, t)), null == f) throw TypeError("Process must have procedure or code set");
            return {
                id: o,
                ports: u,
                procedure: f,
                autostart: d,
                async: y,
                meta: i({}, O)
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
        });
        var s = r(2), a = r(5);
        t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return u;
        });
        var i = this && this.__assign || Object.assign || function(e) {
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
            var t = 0, r = a;
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
        }, a = [], i = {}, u = 0; u < 256; u++) a[u] = (u + 256).toString(16).substr(1), 
        i[a[u]] = u;
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
            function a(e) {
                null == e || "object" != typeof e || e instanceof Array || (M = Object.assign({}, M, e));
            }
            function i(e) {
                L = e;
            }
            function u(e) {
                return U.es[e] && U.es[e].val;
            }
            function f(e, t) {
                var r = S(e);
                r.accept && !r.accept(t, r.val) || (r.val = t, I[e] = !0, G = !0, P());
            }
            function p(e, t) {
                f(e, t(u(e)));
            }
            function l(e, t) {
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
                for (var c in r.arcs) b(w[c]);
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
                w[t.id] = t, b(t);
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
            function b(e) {
                var t = e.process, r = e.entity, n = x(t), c = S(r), s = R[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] == o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    c.accept && !c.accept(e, c.val) || (c.val = e, null != e && (I[c.id] = !0, G = !0), 
                    D || P());
                }));
            }
            function m(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) g(e.arcs[t]);
                e.meta && a(e.meta);
            }
            function P() {
                L && console.log("flushing graph recursively with", I);
                var e = Object.keys(I);
                if (G) {
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t];
                        if (I[r]) {
                            var n = U.es[r];
                            for (var o in n.reactions) T(n.reactions[o]);
                        }
                    }
                    var c = {};
                    I = {}, G = !1, D = !0;
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t], n = U.es[r];
                        n.cb.length > 0 && (Y[r] = n);
                        for (var o in n.effects) c[o] || (T(n.effects[o]), c[o] = !0);
                    }
                    if (D = !1, G) P(); else {
                        var s = Object.keys(Y);
                        Y = {};
                        for (var t in s) for (var n = U.es[s[t]], a = 0; a < n.cb.length; a++) n.cb[a](n.val);
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
                    T(e);
                }, 10) : (T(e), e.out && (I[e.out.id] = !1, G = !0));
            }
            function E(e) {
                var t = x(e);
                T(t), t.async || P();
            }
            function A(e) {
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
                    arcs: {},
                    cb: []
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
                stop: A,
                flush: P,
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
            var t, o, c = e.value, a = r.i(l.a)(), i = [], u = {};
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
                return o = e, u;
            }, u.getId = function() {
                return a;
            }, e.procedure && i.push(e), u.react = function(e, t, r) {
                var n = s(e, t, r);
                n.pidSuffix = "Reaction";
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: u,
                    type: p.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), i.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[a] = r.i(p.createEntity)({
                    id: a,
                    value: c,
                    accept: o
                }), i.forEach(function(o) {
                    var c = o.dependencies, s = o.processId ? n(o.processId, t) : a + o.pidSuffix + (c && c.length ? ":" + c.reduce(function(e, t) {
                        var r = t.entity.getId();
                        return r === a ? e : e + ":" + r;
                    }, "") : ""), i = [];
                    if (c) for (var u in c) {
                        var f = c[u];
                        if (i[u] = f.type, f.type !== p.PORT_TYPES.ACCUMULATOR) {
                            var l = r.i(p.createArc)({
                                process: s,
                                entity: f.entity.getId(),
                                port: u
                            });
                            e.arcs[l.id] = l;
                        }
                    }
                    var d = r.i(p.createArc)({
                        process: s,
                        entity: a
                    });
                    e.arcs[d.id] = d, e.processes[s] = r.i(p.createProcess)({
                        id: s,
                        ports: i,
                        procedure: o.procedure,
                        async: o.async,
                        autostart: o.autostart
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
            return null != e && (n.dependencies = e), "string" == typeof r ? n.processId = r : n.pidSuffix = "Stream", 
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
        });
        var f = r(1), p = r(0), l = r(2);
        t.val = c, r.d(t, "stream", function() {
            return v;
        }), r.d(t, "asyncStream", function() {
            return y;
        }), r.d(t, "streamStart", function() {
            return O;
        }), r.d(t, "asyncStreamStart", function() {
            return h;
        }), t.isEntity = a, t.resolveEntityIds = i, t.getGraphFromAll = u;
        var d = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, v = function(e, t, r) {
            return o(s(e, t, r));
        }, y = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0
            }));
        }, O = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                autostart: !0
            }));
        }, h = function(e, t, r) {
            return o(d({}, s(e, t, r), {
                async: !0,
                autostart: !0
            }));
        };
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
            return a;
        }), r.d(t, "create", function() {
            return i;
        }), r.d(t, "types", function() {
            return u;
        }), r.d(t, "utils", function() {
            return f;
        }), t.default = n;
        var a = n, i = n.create, u = s, f = {
            entityRef: o,
            graph: c
        };
    } ]);
});