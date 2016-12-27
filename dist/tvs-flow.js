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
        var s = n(o), i = r(5), c = n(i), a = r(6), u = n(a), f = r(2), l = n(f);
        t.default = s;
        t.runtime = s, t.types = l, t.utils = {
            entitySpec: c,
            entityRef: u
        };
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t;
        }
        function o() {
            function e() {
                return {
                    entities: M,
                    processes: w,
                    arcs: U,
                    meta: Y
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
            function o() {
                return Y;
            }
            function i(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : s(e)) || e instanceof Array || (Y = Object.assign({}, Y, e));
            }
            function a(e) {
                I = e;
            }
            function u(e) {
                return k.es[e] && k.es[e].val;
            }
            function f(e, t) {
                var r = C(e);
                r.val = t, j(r), g();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function p(e, t) {
                var r = C(e);
                r.cb = t;
            }
            function d(e) {
                var t = C(e);
                delete t.cb;
            }
            function v(e) {
                var t = c.createEntity(e);
                M[t.id] = t;
                var r = C(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                j(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), j(r)), t;
            }
            function y(e) {
                var t = C(e);
                for (var r in t.arcs) T(r);
                delete k.es[e], delete M[e];
            }
            function O(e) {
                var t = c.createProcess(e, L);
                w[t.id] = t;
                var r = R(t.id);
                delete r.acc, r.values = Array.isArray(t.ports) ? [] : {}, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var s = U[o].port;
                    s && (n.indexOf(s) < 0 || t.ports[s] === c.PORT_TYPES.ACCUMULATOR) && T(o);
                }
                for (var i in t.ports) t.ports[i] === c.PORT_TYPES.ACCUMULATOR && (r.acc = i);
                for (var a in r.arcs) b(U[a]);
                return t;
            }
            function m(e) {
                var t = R(e);
                t.stop && t.stop();
                for (var r in t.arcs) T(r);
                delete k.ps[e], delete w[e];
            }
            function P(e) {
                var t = c.createArc(e);
                U[t.id] = t, b(t);
                var r = R(t.process), n = w[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && _(r), 
                t;
            }
            function T(e) {
                var t = U[e];
                if (t) {
                    var r = R(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete U[e];
            }
            function b(e) {
                var t = e.process, r = e.entity, n = R(t), o = C(r), s = w[t];
                o.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, s.ports[e.port] == c.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, j(o), W ? q = !0 : g();
                }, n.out = o, null != n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var r in e.processes) O(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) P(e.arcs[n]);
                e.meta && i(e.meta);
            }
            function j(e, t) {
                H[e.id] = t || !0;
            }
            function E(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = arguments[2];
                if (N[e.id] = !0, e.cb && (F[e.id] = e), !r || null == r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var s in e.effects) {
                    var i = e.effects[s];
                    if (i.async) J[s] = i; else {
                        if (null != i.acc && i.out && null == i.out.val) continue;
                        G[s] ? G[s].level < t && (G[s].level = t) : G[s] = {
                            level: t,
                            eP: i
                        }, i.out && E(i.out, t + 1, i);
                    }
                }
            }
            function g() {
                I && console.log("flushing graph with", H), N = {}, G = {}, J = {}, F = {};
                for (var e in H) E(k.es[e], 0, H[e]);
                H = {};
                for (var t in G) {
                    var r = G[t];
                    D[r.level] ? D[r.level].push(r.eP) : D[r.level] = [ r.eP ];
                }
                for (var n = 0; n < D.length; n++) for (var o = 0; o < D[n].length; o++) S(D[n][o], N);
                D.length = 0;
                for (var s in F) F[s].cb(F[s].val);
                W = !0, q = !1;
                for (var i in J) S(J[i], N);
                W = !1, q && g();
            }
            function S(e, t) {
                I && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = w[e.id].procedure.call(L, e.values, e.sink); else {
                    var o = w[e.id].procedure.call(L, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function _(e) {
                e.async ? setTimeout(function() {
                    S(e);
                }, 10) : (S(e), j(e.out));
            }
            function A(e) {
                var t = R(e);
                S(t), t.out && !t.async && (j(t.out, t), g());
            }
            function x(e) {
                var t = R(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return M[e] || v({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function R(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var M = {}, w = {}, U = {}, Y = {}, L = null, k = {
                es: {},
                ps: {}
            }, I = !1, H = {}, D = [], F = {}, G = {}, J = {}, N = {}, W = !1, q = !1;
            return {
                addEntity: v,
                removeEntity: y,
                addProcess: O,
                removeProcess: m,
                addArc: P,
                removeArc: T,
                addGraph: h,
                getGraph: e,
                getState: t,
                setMeta: i,
                getMeta: o,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: u,
                set: f,
                update: l,
                on: p,
                off: d,
                start: A,
                stop: x,
                flush: g,
                PORT_TYPES: Object.assign({}, c.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        };
        t.create = o;
        var i = r(2), c = n(i);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, i.v4)() : t, n = e.value, o = e.json, s = e.isEvent, c = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: s,
                meta: Object.assign({}, c)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, i.v4)() : r, o = e.ports, s = void 0 === o ? {} : o, a = e.procedure, u = e.code, f = e.autostart, l = void 0 !== f && f, p = e.async, d = void 0 !== p && p, v = e.meta;
            if (null == a && null != u && (a = (0, c.evaluate)(u, t)), null == u && a && (u = a.toString()), 
            null == u || null == a) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: s,
                procedure: a,
                code: u,
                autostart: l,
                async: d,
                meta: Object.assign({}, v)
            };
        }
        function s(e) {
            var t = e.id, r = e.entity, n = e.process, o = e.port, s = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == o ? n + "->" + r : r + "->" + n + "::" + o), {
                id: t,
                entity: r,
                process: n,
                port: o,
                meta: Object.assign({}, s)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.PORT_TYPES = void 0, t.createEntity = n, t.createProcess = o, t.createArc = s;
        var i = r(3), c = r(4);
        t.PORT_TYPES = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = 0, r = i;
            return r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]];
        }
        function n() {
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.v4 = n;
        for (var o = new Array(16), s = function() {
            for (var e, t = 0; t < 16; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, i = [], c = {}, a = 0; a < 256; a++) i[a] = (a + 256).toString(16).substr(1), 
        c[i[a]] = a;
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
        function n(e) {
            var t = e.split(" "), r = l(t, 2), n = r[0], o = r[1], s = v[n.toUpperCase()];
            return {
                type: s,
                eid: o
            };
        }
        function o(e, t) {
            return t ? t + "." + e : e;
        }
        function s(e, t) {
            var r = /^\.*/.exec(e), n = r ? r[0].length : 0, s = e.substr(n);
            if (t) {
                for (var i = t.trim().split("."), c = 0; c < n - 1; c++) i.pop();
                return t = i.join("."), o(s, t);
            }
            return s;
        }
        function i(e, t, r) {
            e = o(e, r);
            var i = t.id || e + d, c = {
                id: i,
                procedure: t.do
            }, a = {
                entities: [],
                processes: [ c ],
                arcs: [ {
                    process: i,
                    entity: e
                } ]
            };
            if (t.autostart && (c.autostart = t.autostart), t.async && (c.async = t.async), 
            t.meta && (c.meta = t.meta), t.with) {
                c.ports = {};
                for (var u in t.with) {
                    var f = n(t.with[u]);
                    c.ports[u] = f.type, f.eid && (0 === f.eid.indexOf(".") && (f.eid = s(f.eid, r)), 
                    a.arcs.push({
                        entity: f.eid,
                        process: i,
                        port: u
                    }));
                }
            }
            return a;
        }
        function c() {
            return {
                entities: [],
                processes: [],
                arcs: []
            };
        }
        function a(e, t) {
            return {
                entities: e.entities.concat(t.entities),
                processes: e.processes.concat(t.processes),
                arcs: e.arcs.concat(t.arcs)
            };
        }
        function u(e, t, r) {
            var n = c(), s = o(e, r), u = {
                id: s
            };
            return null != t.val && (u.value = t.val), t.json && (u.json = t.json), t.isEvent && (u.isEvent = t.isEvent), 
            t.meta && (u.meta = t.meta), t.stream && (n = a(n, i(e, t.stream, r))), t.streams && (n = t.streams.map(function(t) {
                return i(e, t, r);
            }).map(function(e, t) {
                return e.processes[0].id += t + 1, e.arcs.forEach(function(e) {
                    return e.process += t + 1;
                }), e;
            }).reduce(a, n)), n.entities.push(u), n;
        }
        function f(e, t) {
            return Object.keys(e).map(function(r) {
                return u(r, e[r], t);
            }).reduce(a, c());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var l = function() {
            function e(e, t) {
                var r = [], n = !0, o = !1, s = void 0;
                try {
                    for (var i, c = e[Symbol.iterator](); !(n = (i = c.next()).done) && (r.push(i.value), 
                    !t || r.length !== t); n = !0) ;
                } catch (e) {
                    o = !0, s = e;
                } finally {
                    try {
                        !n && c.return && c.return();
                    } finally {
                        if (o) throw s;
                    }
                }
                return r;
            }
            return function(t, r) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return e(t, r);
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            };
        }();
        t.processProcessSpec = i, t.processEntitySpec = u, t.toGraph = f;
        var p = r(2), d = "Stream", v = {
            H: p.PORT_TYPES.HOT,
            C: p.PORT_TYPES.COLD,
            A: p.PORT_TYPES.ACCUMULATOR
        };
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
                        isEvent: i,
                        value: t.value,
                        json: t.json
                    });
                }
                function o(t, r) {
                    v.onId(function(o) {
                        var i = t.processId ? n(t.processId, l) : o + r, c = t.dependencies, a = [];
                        if (c) for (var u in c) {
                            var f = c[u];
                            a[u] = f.type;
                        }
                        if (e.addProcess({
                            id: i,
                            procedure: t.procedure,
                            ports: a,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: i,
                            entity: o
                        }), c) {
                            var p = function(t) {
                                var r = c[t];
                                r.type !== s.PORT_TYPES.ACCUMULATOR && r.entity.onId(function(r) {
                                    e.addArc({
                                        entity: r,
                                        process: i,
                                        port: t
                                    });
                                });
                            };
                            for (var d in c) p(d);
                        }
                    });
                }
                var i = void 0, f = void 0, l = void 0, p = 0, d = [], v = {};
                return v.HOT = {
                    entity: v,
                    type: s.PORT_TYPES.HOT
                }, v.COLD = {
                    entity: v,
                    type: s.PORT_TYPES.COLD
                }, v.getId = function() {
                    return f;
                }, v.onId = function(e) {
                    d.push(e), f && e(f);
                }, v.id = function(t, o) {
                    var s = n(t, o);
                    return f === s ? v : (f && e.removeEntity(f), l = o, f = s, r(), d.forEach(function(e) {
                        return e(s);
                    }), v);
                }, v.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return i = e, r(), v;
                }, t.procedure && o(t, c), v.react = function(e, t, r) {
                    var n = u(e, t, r), i = n.dependencies;
                    return n.dependencies = [ {
                        entity: v,
                        type: s.PORT_TYPES.ACCUMULATOR
                    } ], i && i.length && (n.dependencies = n.dependencies.concat(i)), o(n, a + p++), 
                    v;
                }, v;
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
                return t(i({}, u(e, r, n), {
                    async: !0
                }));
            }
            function p(e, r, n) {
                return t(i({}, u(e, r, n), {
                    autostart: !0
                }));
            }
            function d(e, r, n) {
                return t(i({}, u(e, r, n), {
                    async: !0,
                    autostart: !0
                }));
            }
            function v(e, t) {
                for (var r in e) {
                    var n = e[r];
                    "function" == typeof n.id && n.HOT && n.COLD && n.id(r, t);
                }
            }
            return {
                val: r,
                json: o,
                stream: f,
                streamStart: p,
                asyncStream: l,
                asyncStreamStart: d,
                addToFlow: v
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = o;
        var s = r(2), i = Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, c = "Stream", a = "Reaction";
    } ]);
});