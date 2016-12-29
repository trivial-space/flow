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
        var c = n(o), i = r(5), s = n(i), u = r(2), a = n(u);
        t.default = c;
        t.runtime = c, t.types = a, t.utils = {
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
        function o() {
            function e() {
                return {
                    entities: M,
                    processes: w,
                    arcs: U,
                    meta: L
                };
            }
            function t() {
                var e = {};
                for (var t in k.es) e[t] = k.es[t].val;
                return e;
            }
            function r() {
                return Y;
            }
            function n(e) {
                Y = e;
            }
            function o() {
                return L;
            }
            function i(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : c(e)) || e instanceof Array || (L = Object.assign({}, L, e));
            }
            function u(e) {
                I = e;
            }
            function a(e) {
                return k.es[e] && k.es[e].val;
            }
            function f(e, t) {
                var r = C(e);
                r.val = t, j(r), E();
            }
            function l(e, t) {
                f(e, t(a(e)));
            }
            function d(e, t) {
                var r = C(e);
                r.cb = t;
            }
            function v(e) {
                var t = C(e);
                delete t.cb;
            }
            function p(e) {
                var t = s.createEntity(e);
                M[t.id] = t;
                var r = C(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                j(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), j(r)), t;
            }
            function y(e) {
                var t = C(e);
                for (var r in t.arcs) b(r);
                delete k.es[e], delete M[e];
            }
            function O(e) {
                var t = s.createProcess(e, Y);
                w[t.id] = t;
                var r = R(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = U[e].port;
                    null == r || t.ports[r] && t.ports[r] !== s.PORT_TYPES.ACCUMULATOR || b(e);
                });
                for (var n in t.ports) t.ports[n] === s.PORT_TYPES.ACCUMULATOR && (r.acc = n);
                for (var o in r.arcs) m(U[o]);
                return t;
            }
            function P(e) {
                var t = R(e);
                t.stop && t.stop();
                for (var r in t.arcs) b(r);
                delete k.ps[e], delete w[e];
            }
            function T(e) {
                var t = s.createArc(e);
                U[t.id] = t, m(t);
                var r = R(t.process), n = w[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && S(r), 
                t;
            }
            function b(e) {
                var t = U[e];
                if (t) {
                    var r = R(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.sink = function() {}, delete r.out, 
                    delete n.reactions[t.process]);
                }
                delete U[e];
            }
            function m(e) {
                var t = e.process, r = e.entity, n = R(t), o = C(r), c = w[t];
                o.arcs[e.id] = !0, c && (n.arcs[e.id] = !0, null != e.port ? (delete o.effects[t], 
                c.ports && null != c.ports[e.port] && (n.sources[e.port] = o, c.ports[e.port] == s.PORT_TYPES.HOT && (o.effects[t] = n))) : (n.sink = function(e) {
                    o.val = e, j(o), W ? q = !0 : E();
                }, n.out = o, null != n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function g(e) {
                if (e.entities) for (var t in e.entities) p(e.entities[t]);
                if (e.processes) for (var r in e.processes) O(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) T(e.arcs[n]);
                e.meta && i(e.meta);
            }
            function j(e, t) {
                D[e.id] = t || !0;
            }
            function h(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = arguments[2];
                if (N[e.id] = !0, e.cb && (F[e.id] = e), !r || null == r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var c in e.effects) {
                    var i = e.effects[c];
                    if (i.async) J[c] = i; else {
                        if (null != i.acc && i.out && null == i.out.val) continue;
                        G[c] ? G[c].level < t && (G[c].level = t) : G[c] = {
                            level: t,
                            eP: i
                        }, i.out && h(i.out, t + 1, i);
                    }
                }
            }
            function E() {
                I && console.log("flushing graph with", D), N = {}, G = {}, J = {}, F = {};
                for (var e in D) h(k.es[e], 0, D[e]);
                D = {};
                for (var t in G) {
                    var r = G[t];
                    H[r.level] ? H[r.level].push(r.eP) : H[r.level] = [ r.eP ];
                }
                for (var n = 0; n < H.length; n++) for (var o = 0; o < H[n].length; o++) _(H[n][o], N);
                H.length = 0;
                for (var c in F) F[c].cb(F[c].val);
                W = !0, q = !1;
                for (var i in J) _(J[i], N);
                W = !1, q && E();
            }
            function _(e, t) {
                I && console.log("executing process", e.id);
                for (var r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    !n || !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = w[e.id].procedure.apply(Y, [ e.sink ].concat(e.values)); else {
                    var o = w[e.id].procedure.apply(Y, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function S(e) {
                e.async ? setTimeout(function() {
                    _(e);
                }, 10) : (_(e), j(e.out));
            }
            function A(e) {
                var t = R(e);
                _(t), t.out && !t.async && (j(t.out, t), E());
            }
            function x(e) {
                var t = R(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return M[e] || p({
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
                    arcs: {},
                    sink: function() {}
                });
            }
            var M = {}, w = {}, U = {}, L = {}, Y = null, k = {
                es: {},
                ps: {}
            }, I = !1, D = {}, H = [], F = {}, G = {}, J = {}, N = {}, W = !1, q = !1;
            return {
                addEntity: p,
                removeEntity: y,
                addProcess: O,
                removeProcess: P,
                addArc: T,
                removeArc: b,
                addGraph: g,
                getGraph: e,
                getState: t,
                setMeta: i,
                getMeta: o,
                getContext: r,
                setContext: n,
                setDebug: u,
                get: a,
                set: f,
                update: l,
                on: d,
                off: v,
                start: A,
                stop: x,
                flush: E,
                PORT_TYPES: Object.assign({}, s.PORT_TYPES)
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
        t.create = o;
        var i = r(2), s = n(i);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, i.v4)() : t, n = e.value, o = e.json, c = e.isEvent, s = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: c,
                meta: Object.assign({}, s)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, i.v4)() : r, o = e.ports, c = void 0 === o ? [] : o, u = e.procedure, a = e.code, f = e.autostart, l = void 0 !== f && f, d = e.async, v = void 0 !== d && d, p = e.meta;
            if (null == u && null != a && (u = (0, s.evaluate)(a, t)), null == a && u && (a = u.toString()), 
            null == a || null == u) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: c,
                procedure: u,
                code: a,
                autostart: l,
                async: v,
                meta: Object.assign({}, p)
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
                meta: Object.assign({}, c)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.PORT_TYPES = void 0, t.createEntity = n, t.createProcess = o, t.createArc = c;
        var i = r(3), s = r(4);
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
            var e = c();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.v4 = n;
        for (var o = new Array(16), c = function() {
            for (var e, t = 0; t < 16; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, i = [], s = {}, u = 0; u < 256; u++) i[u] = (u + 256).toString(16).substr(1), 
        s[i[u]] = u;
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
                    d && e.addEntity({
                        id: d,
                        isEvent: l,
                        value: i,
                        json: f
                    });
                }
                function o(t, r) {
                    O.onId(function(o) {
                        var i = t.processId ? n(t.processId, v) : o + r, s = t.dependencies, u = [];
                        if (s) for (var a in s) {
                            var f = s[a];
                            u[a] = f.type;
                        }
                        if (e.addProcess({
                            id: i,
                            procedure: t.procedure,
                            ports: u,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: i,
                            entity: o
                        }), s) {
                            var l = function(t) {
                                var r = s[t];
                                r.type !== c.PORT_TYPES.ACCUMULATOR && r.entity.onId(function(r) {
                                    e.addArc({
                                        entity: r,
                                        process: i,
                                        port: t
                                    });
                                });
                            };
                            for (var d in s) l(d);
                        }
                    });
                }
                var i = t.value, f = t.json, l = void 0, d = void 0, v = void 0, p = 0, y = [], O = {};
                return O.HOT = {
                    entity: O,
                    type: c.PORT_TYPES.HOT
                }, O.COLD = {
                    entity: O,
                    type: c.PORT_TYPES.COLD
                }, O.getId = function() {
                    return d;
                }, O.onId = function(e) {
                    y.push(e), d && e(d);
                }, O.id = function(t, o) {
                    var c = n(t, o);
                    return d === c ? O : (d && e.removeEntity(d), v = o, d = c, r(), y.forEach(function(e) {
                        return e(c);
                    }), O);
                }, O.val = function(e) {
                    return i = e, r(), O;
                }, O.json = function(e) {
                    return f = e, r(), O;
                }, O.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return l = e, r(), O;
                }, t.procedure && o(t, s), O.react = function(e, t, r) {
                    var n = a(e, t, r), i = n.dependencies;
                    return n.dependencies = [ {
                        entity: O,
                        type: c.PORT_TYPES.ACCUMULATOR
                    } ], i && i.length && (n.dependencies = n.dependencies.concat(i)), o(n, u + p++), 
                    O;
                }, O;
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
            function a(e, t, r) {
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
                return t(a(e, r, n));
            }
            function l(e, r, n) {
                return t(i({}, a(e, r, n), {
                    async: !0
                }));
            }
            function d(e, r, n) {
                return t(i({}, a(e, r, n), {
                    autostart: !0
                }));
            }
            function v(e, r, n) {
                return t(i({}, a(e, r, n), {
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
        var c = r(2), i = Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, s = "Stream", u = "Reaction";
    } ]);
});