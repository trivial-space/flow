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
        }, t.p = "", t(t.s = 5);
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
            var n = e.id, o = void 0 === n ? r.i(s.a)() : n, c = e.ports, u = void 0 === c ? [] : c, f = e.procedure, p = e.code, l = e.autostart, d = void 0 !== l && l, v = e.async, y = void 0 !== v && v, h = e.meta;
            if (null == f && null != p && (f = r.i(i.a)(p, t)), null == f) throw TypeError("Process must have procedure or code set");
            return {
                id: o,
                ports: u,
                procedure: f,
                autostart: d,
                async: y,
                meta: a({}, h)
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
        var s = r(2), i = r(6), a = this && this.__assign || Object.assign || function(e) {
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
            function n() {
                return L;
            }
            function s(e) {
                L = e;
            }
            function i() {
                return U;
            }
            function a(e) {
                null == e || "object" != typeof e || e instanceof Array || (U = c({}, U, e));
            }
            function u(e) {
                Y = e;
            }
            function f(e) {
                return k.es[e] && k.es[e].val;
            }
            function p(e, t) {
                var r = S(e);
                r.accept && !r.accept(t, r.val) || (r.val = t, D[e] = !0, H = !0, T());
            }
            function l(e, t) {
                p(e, t(f(e)));
            }
            function d(e, t) {
                S(e).cb.push(t);
            }
            function v(e, t) {
                var r = S(e);
                r.cb = t ? r.cb.filter(function(e) {
                    return e !== t;
                }) : [];
            }
            function y(e) {
                var t = r.i(o.createEntity)(e);
                R[t.id] = t;
                var n = S(t.id);
                return null != t.value && null == n.val && (n.val = t.value, D[t.id] = !1, H = !0), 
                n.accept = t.accept, t;
            }
            function h(e) {
                var t = S(e);
                for (var r in t.arcs) b(r);
                delete k.es[e], delete R[e];
            }
            function O(e) {
                var t = r.i(o.createProcess)(e, L);
                w[t.id] = t;
                var n = C(t.id);
                delete n.acc, n.values = [], n.sources = [], n.async = t.async, Object.keys(n.arcs).forEach(function(e) {
                    var r = M[e].port;
                    null == r || t.ports[r] && t.ports[r] !== o.PORT_TYPES.ACCUMULATOR || b(e);
                }), t.ports.forEach(function(e, t) {
                    e === o.PORT_TYPES.ACCUMULATOR && (n.acc = t);
                });
                for (var c in n.arcs) m(M[c]);
                return t;
            }
            function g(e) {
                var t = C(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) b(r);
                delete k.ps[e], delete w[e];
            }
            function _(e) {
                var t = r.i(o.createArc)(e);
                M[t.id] = t, m(t);
                var n = C(t.process), c = w[t.process];
                return c && !0 === c.autostart && Object.keys(n.arcs).length === Object.keys(c.ports).length + 1 && E(n), 
                t;
            }
            function b(e) {
                var t = M[e];
                if (t) {
                    var r = C(t.process), n = S(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete M[e];
            }
            function m(e) {
                var t = e.process, r = e.entity, n = C(t), c = S(r), s = w[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] === o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.out = c, 
                null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t], 
                n.sink = function(e) {
                    c.accept && !c.accept(e, c.val) || (c.val = e, null != e && (D[c.id] = !0, H = !0), 
                    G || T());
                }));
            }
            function P(e) {
                if (e.entities) for (var t in e.entities) y(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) _(e.arcs[t]);
                e.meta && a(e.meta);
            }
            function T() {
                Y && console.log("flushing graph recursively with", D);
                var e = Object.keys(D);
                if (H) {
                    for (var t = 0, r = e; t < r.length; t++) {
                        var n = r[t];
                        if (D[n]) {
                            var o = k.es[n];
                            for (var c in o.reactions) j(o.reactions[c]);
                        }
                    }
                    var s = {};
                    D = {}, H = !1, G = !0;
                    for (var i = 0, a = e; i < a.length; i++) {
                        var n = a[i], o = k.es[n];
                        o.cb.length > 0 && (I[n] = o);
                        for (var c in o.effects) s[c] || (j(o.effects[c]), s[c] = !0);
                    }
                    if (G = !1, H) T(); else {
                        var u = Object.keys(I);
                        I = {};
                        for (var f in u) for (var o = k.es[u[f]], p = 0, l = o.cb; p < l.length; p++) {
                            var d = l[p];
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
                    e.values[r] = n.val;
                }
                if (t) if (Y && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = w[e.id].procedure.apply(L, [ e.sink ].concat(e.values)); else {
                    var o = w[e.id].procedure.apply(L, e.values);
                    if (e.out) {
                        var c = e.out;
                        c.accept && !c.accept(o, c.val) || (c.val = o, null != o && (D[e.out.id] = null == e.acc, 
                        H = !0));
                    }
                }
            }
            function E(e) {
                e.async ? setTimeout(function() {
                    j(e);
                }, 10) : (j(e), e.out && (D[e.out.id] = !1, H = !0));
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
                return R[e] || y({
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
            }, U = {}, L = null, Y = !1, I = {}, D = {}, G = !1, H = !1;
            return {
                addEntity: y,
                removeEntity: h,
                addProcess: O,
                removeProcess: g,
                addArc: _,
                removeArc: b,
                addGraph: P,
                getGraph: e,
                getState: t,
                setMeta: a,
                getMeta: i,
                getContext: n,
                setContext: s,
                setDebug: u,
                get: f,
                set: p,
                update: l,
                on: d,
                off: v,
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
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            var t, o, c = e.value, i = r.i(l.a)(), a = [], u = {};
            return u.HOT = {
                entity: u,
                type: p.PORT_TYPES.HOT
            }, u.COLD = {
                entity: u,
                type: p.PORT_TYPES.COLD
            }, u.id = function(e, r) {
                return i = n(e, r), t = r, u;
            }, u.val = function(e) {
                return c = e, u;
            }, u.accept = function(e) {
                return o = e, u;
            }, u.getId = function() {
                return i;
            }, e.procedure && a.push(e), u.react = function(e, t, r) {
                var n = s(e, t, r);
                n.pidSuffix = y;
                var o = n.dependencies;
                return n.dependencies = [ {
                    entity: u,
                    type: p.PORT_TYPES.ACCUMULATOR
                } ], o && o.length && (n.dependencies = n.dependencies.concat(o)), a.push(n), u;
            }, u.getGraph = function() {
                var e = f.empty();
                return e.entities[i] = r.i(p.createEntity)({
                    id: i,
                    value: c,
                    accept: o
                }), a.forEach(function(o) {
                    var c = o.dependencies, s = o.processId ? n(o.processId, t) : i + o.pidSuffix + (c && c.length ? ":" + c.reduce(function(e, t) {
                        var r = t.entity.getId();
                        return r === i ? e : e + ":" + r;
                    }, "") : ""), a = [];
                    c && c.forEach(function(t, n) {
                        if (a[n] = t.type, t.type !== p.PORT_TYPES.ACCUMULATOR) {
                            var o = r.i(p.createArc)({
                                process: s,
                                entity: t.entity.getId(),
                                port: n
                            });
                            e.arcs[o.id] = o;
                        }
                    });
                    var u = r.i(p.createArc)({
                        process: s,
                        entity: i
                    });
                    e.arcs[u.id] = u, e.processes[s] = r.i(p.createProcess)({
                        id: s,
                        ports: a,
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
            return h;
        }), r.d(t, "asyncStream", function() {
            return O;
        }), r.d(t, "streamStart", function() {
            return g;
        }), r.d(t, "asyncStreamStart", function() {
            return _;
        }), t.isEntity = i, t.resolveEntityIds = a, t.getGraphFromAll = u;
        var f = r(1), p = r(0), l = r(2), d = this && this.__assign || Object.assign || function(e) {
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
        var n = r(3), o = r(4), c = r(1), s = r(0);
        t.default = n;
        var i = n, a = n.create, u = s, f = {
            entityRef: o,
            graph: c
        };
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        __webpack_exports__.a = evaluate;
    } ]);
});