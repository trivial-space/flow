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
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = r(1), a = n(o);
        t["default"] = a["default"], e.exports = t["default"];
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            return e && "undefined" != typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e;
        }
        function a() {
            function e() {
                return {
                    entities: R,
                    processes: w,
                    arcs: L,
                    meta: U
                };
            }
            function t() {
                var e = {};
                for (var t in D.es) e[t] = D.es[t].val;
                return e;
            }
            function r() {
                return Y;
            }
            function n(e) {
                Y = e;
            }
            function a() {
                return U;
            }
            function c(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : o(e)) || e instanceof Array || (U = s({}, U, e));
            }
            function i(e) {
                F = e;
            }
            function l(e) {
                return D.es[e] && D.es[e].val;
            }
            function f(e, t) {
                var r = k(e);
                r.val = t, E(r), T();
            }
            function v(e, t) {
                f(e, t(l(e)));
            }
            function d(e, t) {
                var r = k(e);
                r.cb = t;
            }
            function p(e) {
                var t = k(e);
                delete t.cb;
            }
            function y(e) {
                var t = u["default"].createEntity(e);
                R[t.id] = t;
                var r = k(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                E(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), E(r)), t;
            }
            function b(e) {
                var t = k(e);
                for (var r in t.arcs) g(r);
                delete D.es[e], delete R[e];
            }
            function O(e) {
                var t = u["default"].createProcess(e, Y);
                w[t.id] = t;
                var r = C(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var a = L[o].port;
                    a && (n.indexOf(a) < 0 || t.ports[a] === u["default"].PORT_TYPES.ACCUMULATOR) && g(o);
                }
                for (var s in t.ports) t.ports[s] === u["default"].PORT_TYPES.ACCUMULATOR && (r.acc = s);
                for (var c in r.arcs) h(L[c]);
                return t;
            }
            function m(e) {
                var t = C(e);
                t.stop && t.stop();
                for (var r in t.arcs) g(r);
                delete D.ps[e], delete w[e];
            }
            function P(e) {
                var t = u["default"].createArc(e);
                L[t.id] = t, h(t);
                var r = C(t.process), n = w[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && S(r), 
                t;
            }
            function g(e) {
                var t = L[e];
                if (t) {
                    var r = C(t.process), n = k(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete L[e];
            }
            function h(e) {
                var t = e.process, r = e.entity, n = C(t), o = k(r), a = w[t];
                o.arcs[e.id] = !0, a && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, a.ports[e.port] == u["default"].PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, E(o), T();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function x(e) {
                if (e.entities) for (var t in e.entities) y(e.entities[t]);
                if (e.processes) for (var r in e.processes) O(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) P(e.arcs[n]);
                e.meta && c(e.meta), T();
            }
            function E(e, t) {
                G[e.id] = t || !0;
            }
            function j(e) {
                var t = e.syncSchedule, r = e.asyncSchedule, n = e.callbacks, o = e.activeEntities, a = e.eE, s = e.level, c = void 0 === s ? 0 : s, u = e.pLast;
                if (o[a.id] = !0, a.cb && (n[a.id] = a), !u || !u.acc) {
                    var i = !1;
                    for (var l in a.reactions) i = !0, t[l] ? t[l].level < c && (t[l].level = c) : t[l] = {
                        level: c,
                        eP: a.reactions[l]
                    };
                    i && c++;
                }
                for (var f in a.effects) {
                    var v = a.effects[f];
                    v.async ? r[f] = v : (t[f] ? t[f].level < c && (t[f].level = c) : t[f] = {
                        level: c,
                        eP: v
                    }, v.out && j({
                        syncSchedule: t,
                        asyncSchedule: r,
                        callbacks: n,
                        activeEntities: o,
                        eE: v.out,
                        level: c + 1,
                        pLast: v
                    }));
                }
            }
            function T() {
                F && console.log("flushing graph with", G);
                var e = [], t = {}, r = {}, n = {}, o = {};
                for (var a in G) j({
                    syncSchedule: r,
                    asyncSchedule: n,
                    callbacks: t,
                    activeEntities: o,
                    eE: D.es[a],
                    level: 0,
                    pLast: G[a]
                });
                G = {};
                for (var s in r) {
                    var c = r[s];
                    e[c.level] ? e[c.level].push(c.eP) : e[c.level] = [ c.eP ];
                }
                for (var u = 0; u < e.length; u++) for (var i = 0; i < e[u].length; i++) _(e[u][i], o);
                for (var l in t) t[l].cb(t[l].val);
                for (var f in n) _(n[f], o);
            }
            function _(e, t) {
                F && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = w[e.id].procedure.call(Y, e.values, e.sink); else {
                    var o = w[e.id].procedure.call(Y, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function S(e) {
                e.async ? setTimeout(function() {
                    _(e);
                }, 10) : (_(e), E(e.out));
            }
            function M(e) {
                var t = C(e);
                _(t), t.out && !t.async && (E(t.out, t), T());
            }
            function A(e) {
                var t = C(e);
                t.stop && t.stop(), delete t.stop;
            }
            function k(e) {
                return R[e] || y({
                    id: e
                }), D.es[e] || (D.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function C(e) {
                return D.ps[e] || (D.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var R = {}, w = {}, L = {}, U = {}, Y = null, D = {
                es: {},
                ps: {}
            }, F = !1, G = {};
            return {
                addEntity: y,
                removeEntity: b,
                addProcess: O,
                removeProcess: m,
                addArc: P,
                removeArc: g,
                addGraph: x,
                getGraph: e,
                getState: t,
                setMeta: c,
                getMeta: a,
                getContext: r,
                setContext: n,
                setDebug: i,
                get: l,
                set: f,
                update: v,
                on: d,
                off: p,
                start: M,
                stop: A,
                PORT_TYPES: s({}, u["default"].PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            }
            return e;
        }, c = r(2), u = n(c);
        t["default"] = {
            create: a
        }, e.exports = t["default"];
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, c.v4)() : t, n = e.value, o = e.json, a = e.isEvent, u = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: a,
                meta: s({}, u)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, c.v4)() : r, o = e.ports, a = void 0 === o ? {} : o, i = e.procedure, l = e.code, f = e.autostart, v = e.async, d = e.meta;
            return null == l && (l = i.toString()), null == i && (i = (0, u.evaluate)(l, t)), 
            {
                id: n,
                ports: a,
                procedure: i,
                code: l,
                autostart: f,
                async: v,
                meta: s({}, d)
            };
        }
        function a(e) {
            var t = e.id, r = e.entity, n = e.process, o = e.port, a = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == o ? n + "->" + r : r + "->" + n + "::" + o), {
                id: t,
                entity: r,
                process: n,
                port: o,
                meta: s({}, a)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            }
            return e;
        }, c = r(3), u = r(4), i = {
            COLD: "cold",
            HOT: "hot",
            ACCUMULATOR: "accumulator"
        };
        t["default"] = {
            createEntity: n,
            createProcess: o,
            createArc: a,
            PORT_TYPES: i
        }, e.exports = t["default"];
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = 0, r = s;
            return r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]];
        }
        function n() {
            var e = a();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.v4 = n;
        for (var o = new Array(16), a = function() {
            for (var e, t = 0; 16 > t; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, s = [], c = {}, u = 0; 256 > u; u++) s[u] = (u + 256).toString(16).substr(1), 
        c[s[u]] = u;
    }, function(module, exports) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.evaluate = evaluate;
    } ]);
});