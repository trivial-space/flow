!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.tvsFlow = t() : e.tvsFlow = t();
}(this, function() {
    return function(e) {
        function t(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return e[n].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports;
        }
        var r = {};
        return t.m = e, t.c = r, t.p = "", t(0);
    }([ function(e, t, r) {
        "use strict";
        function n(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t;
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.utils = t.types = t.runtime = void 0;
        var o = r(1);
        Object.keys(o).forEach(function(e) {
            "default" !== e && "__esModule" !== e && Object.defineProperty(t, e, {
                enumerable: !0,
                get: function() {
                    return o[e];
                }
            });
        });
        var i = n(o), c = r(5), s = n(c), a = r(2), u = n(a);
        t.default = i;
        t.runtime = i, t.types = u, t.utils = {
            entityRef: s
        };
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t;
        }
        function o(e) {
            if (Array.isArray(e)) {
                for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
                return r;
            }
            return Array.from(e);
        }
        function i() {
            function e() {
                return {
                    entities: w,
                    processes: U,
                    arcs: L,
                    meta: Y
                };
            }
            function t() {
                var e = {};
                for (var t in I.es) e[t] = I.es[t].val;
                return e;
            }
            function r() {
                return k;
            }
            function n(e) {
                k = e;
            }
            function i() {
                return Y;
            }
            function s(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : c(e)) || e instanceof Array || (Y = Object.assign({}, Y, e));
            }
            function u(e) {
                D = e;
            }
            function f(e) {
                return I.es[e] && I.es[e].val;
            }
            function l(e, t) {
                var r = R(e);
                r.val = t, j(r), _();
            }
            function d(e, t) {
                l(e, t(f(e)));
            }
            function v(e, t) {
                var r = R(e);
                r.cb = t;
            }
            function p(e) {
                var t = R(e);
                delete t.cb;
            }
            function y(e) {
                var t = a.createEntity(e);
                w[t.id] = t;
                var r = R(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                j(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), j(r)), t;
            }
            function O(e) {
                var t = R(e);
                for (var r in t.arcs) b(r);
                delete I.es[e], delete w[e];
            }
            function P(e) {
                var t = a.createProcess(e, k);
                U[t.id] = t;
                var r = M(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = L[e].port;
                    null == r || t.ports[r] && t.ports[r] !== a.PORT_TYPES.ACCUMULATOR || b(e);
                });
                for (var n in t.ports) t.ports[n] === a.PORT_TYPES.ACCUMULATOR && (r.acc = n);
                for (var o in r.arcs) g(L[o]);
                return t;
            }
            function T(e) {
                var t = M(e);
                t.stop && t.stop();
                for (var r in t.arcs) b(r);
                delete I.ps[e], delete U[e];
            }
            function m(e) {
                var t = a.createArc(e);
                L[t.id] = t, g(t);
                var r = M(t.process), n = U[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && S(r), 
                t;
            }
            function b(e) {
                var t = L[e];
                if (t) {
                    var r = M(t.process), n = R(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.sink = function() {}, delete r.out, 
                    delete n.reactions[t.process]);
                }
                delete L[e];
            }
            function g(e) {
                var t = e.process, r = e.entity, n = M(t), o = R(r), i = U[t];
                o.arcs[e.id] = !0, i && (n.arcs[e.id] = !0, null != e.port ? (delete o.effects[t], 
                i.ports && null != i.ports[e.port] && (n.sources[e.port] = o, i.ports[e.port] == a.PORT_TYPES.HOT && (o.effects[t] = n))) : (n.sink = function(e) {
                    o.val = e, j(o), q ? z = !0 : _();
                }, n.out = o, null != n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) y(e.entities[t]);
                if (e.processes) for (var r in e.processes) P(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) m(e.arcs[n]);
                e.meta && s(e.meta);
            }
            function j(e, t) {
                H[e.id] = t || !0;
            }
            function E(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = arguments[2];
                if (W[e.id] = !0, e.cb && (G[e.id] = e), !r || null == r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, J[o] ? J[o].level < t && (J[o].level = t) : J[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var i in e.effects) {
                    var c = e.effects[i];
                    if (c.async) N[i] = c; else {
                        if (null != c.acc && c.out && null == c.out.val) continue;
                        J[i] ? J[i].level < t && (J[i].level = t) : J[i] = {
                            level: t,
                            eP: c
                        }, c.out && E(c.out, t + 1, c);
                    }
                }
            }
            function _() {
                D && console.log("flushing graph with", H), W = {}, J = {}, N = {}, G = {};
                for (var e in H) E(I.es[e], 0, H[e]);
                H = {};
                for (var t in J) {
                    var r = J[t];
                    F[r.level] ? F[r.level].push(r.eP) : F[r.level] = [ r.eP ];
                }
                for (var n = 0; n < F.length; n++) for (var o = 0; o < F[n].length; o++) A(F[n][o], W);
                F.length = 0;
                for (var i in G) G[i].cb(G[i].val);
                q = !0, z = !1;
                for (var c in N) A(N[c], W);
                q = !1, z && _();
            }
            function A(e, t) {
                D && console.log("executing process", e.id);
                for (var r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    !n || !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = U[e.id].procedure.apply(k, [ e.sink ].concat(o(e.values))); else {
                    var i = U[e.id].procedure.apply(k, e.values);
                    e.out && (e.out.val = i);
                }
            }
            function S(e) {
                e.async ? setTimeout(function() {
                    A(e);
                }, 10) : (A(e), j(e.out));
            }
            function x(e) {
                var t = M(e);
                A(t), t.out && !t.async && (j(t.out, t), _());
            }
            function C(e) {
                var t = M(e);
                t.stop && t.stop(), delete t.stop;
            }
            function R(e) {
                return w[e] || y({
                    id: e
                }), I.es[e] || (I.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function M(e) {
                return I.ps[e] || (I.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var w = {}, U = {}, L = {}, Y = {}, k = null, I = {
                es: {},
                ps: {}
            }, D = !1, H = {}, F = [], G = {}, J = {}, N = {}, W = {}, q = !1, z = !1;
            return {
                addEntity: y,
                removeEntity: O,
                addProcess: P,
                removeProcess: T,
                addArc: m,
                removeArc: b,
                addGraph: h,
                getGraph: e,
                getState: t,
                setMeta: s,
                getMeta: i,
                getContext: r,
                setContext: n,
                setDebug: u,
                get: f,
                set: l,
                update: d,
                on: v,
                off: p,
                start: x,
                stop: C,
                flush: _,
                PORT_TYPES: Object.assign({}, a.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        };
        t.create = i;
        var s = r(2), a = n(s);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, c.v4)() : t, n = e.value, o = e.json, i = e.isEvent, s = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: i,
                meta: Object.assign({}, s)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, c.v4)() : r, o = e.ports, i = void 0 === o ? [] : o, a = e.procedure, u = e.code, f = e.autostart, l = void 0 !== f && f, d = e.async, v = void 0 !== d && d, p = e.meta;
            if (null == a && null != u && (a = (0, s.evaluate)(u, t)), null == u && a && (u = a.toString()), 
            null == u || null == a) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: i,
                procedure: a,
                code: u,
                autostart: l,
                async: v,
                meta: Object.assign({}, p)
            };
        }
        function i(e) {
            var t = e.id, r = e.entity, n = e.process, o = e.port, i = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == o ? n + "->" + r : r + "->" + n + "::" + o), {
                id: t,
                entity: r,
                process: n,
                port: o,
                meta: Object.assign({}, i)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.PORT_TYPES = void 0, t.createEntity = n, t.createProcess = o, t.createArc = i;
        var c = r(3), s = r(4);
        t.PORT_TYPES = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = 0, r = c;
            return r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]];
        }
        function n() {
            var e = i();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.v4 = n;
        for (var o = new Array(16), i = function() {
            for (var e, t = 0; t < 16; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, c = [], s = {}, a = 0; a < 256; a++) c[a] = (a + 256).toString(16).substr(1), 
        s[c[a]] = a;
    }, function(module, exports) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.evaluate = evaluate;
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            function t(t) {
                function r() {
                    f && e.addEntity({
                        id: f,
                        isEvent: c,
                        value: t.value,
                        json: t.json
                    });
                }
                function o(t, r) {
                    p.onId(function(o) {
                        var c = t.processId ? n(t.processId, l) : o + r, s = t.dependencies, a = [];
                        if (s) for (var u in s) {
                            var f = s[u];
                            a[u] = f.type;
                        }
                        if (e.addProcess({
                            id: c,
                            procedure: t.procedure,
                            ports: a,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: c,
                            entity: o
                        }), s) {
                            var d = function(t) {
                                var r = s[t];
                                r.type !== i.PORT_TYPES.ACCUMULATOR && r.entity.onId(function(r) {
                                    e.addArc({
                                        entity: r,
                                        process: c,
                                        port: t
                                    });
                                });
                            };
                            for (var v in s) d(v);
                        }
                    });
                }
                var c = void 0, f = void 0, l = void 0, d = 0, v = [], p = {};
                return p.HOT = {
                    entity: p,
                    type: i.PORT_TYPES.HOT
                }, p.COLD = {
                    entity: p,
                    type: i.PORT_TYPES.COLD
                }, p.getId = function() {
                    return f;
                }, p.onId = function(e) {
                    v.push(e), f && e(f);
                }, p.id = function(t, o) {
                    var i = n(t, o);
                    return f === i ? p : (f && e.removeEntity(f), l = o, f = i, r(), v.forEach(function(e) {
                        return e(i);
                    }), p);
                }, p.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return c = e, r(), p;
                }, t.procedure && o(t, s), p.react = function(e, t, r) {
                    var n = u(e, t, r), c = n.dependencies;
                    return n.dependencies = [ {
                        entity: p,
                        type: i.PORT_TYPES.ACCUMULATOR
                    } ], c && c.length && (n.dependencies = n.dependencies.concat(c)), o(n, a + d++), 
                    p;
                }, p;
            }
            function r(e) {
                return t({
                    value: e
                });
            }
            function o(e) {
                return t({
                    json: e
                });
            }
            function u(e, t, r) {
                if ("function" == typeof e) return {
                    procedure: e
                };
                if (Array.isArray(e) && "function" == typeof t) return {
                    dependencies: e,
                    procedure: t
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
            function f(e, r, n) {
                return t(u(e, r, n));
            }
            function l(e, r, n) {
                return t(c({}, u(e, r, n), {
                    async: !0
                }));
            }
            function d(e, r, n) {
                return t(c({}, u(e, r, n), {
                    autostart: !0
                }));
            }
            function v(e, r, n) {
                return t(c({}, u(e, r, n), {
                    async: !0,
                    autostart: !0
                }));
            }
            function p(e, t) {
                for (var r in e) {
                    var n = e[r];
                    "function" == typeof n.id && n.HOT && n.COLD && n.id(r, t);
                }
            }
            return {
                val: r,
                json: o,
                stream: f,
                streamStart: d,
                asyncStream: l,
                asyncStreamStart: v,
                addToFlow: p
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = o;
        var i = r(2), c = Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, s = "Stream", a = "Reaction";
    } ]);
});