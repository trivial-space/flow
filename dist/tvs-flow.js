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
            for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
        }
        var o = r(1);
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t["default"] = o, t.runtime = o, n(r(1));
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: R,
                    processes: L,
                    arcs: M,
                    meta: U
                };
            }
            function t() {
                var e = {};
                for (var t in w.es) e[t] = w.es[t].val;
                return e;
            }
            function r() {
                return _;
            }
            function n(e) {
                _ = e;
            }
            function s() {
                return U;
            }
            function c(e) {
                null == e || "object" != typeof e || e instanceof Array || (U = Object.assign({}, U, e));
            }
            function a(e) {
                Y = e;
            }
            function i(e) {
                return w.es[e] && w.es[e].val;
            }
            function u(e, t) {
                var r = C(e);
                r.val = t, h(r), E();
            }
            function l(e, t) {
                u(e, t(i(e)));
            }
            function f(e, t) {
                var r = C(e);
                r.cb = t;
            }
            function v(e) {
                var t = C(e);
                delete t.cb;
            }
            function d(e) {
                var t = o.createEntity(e);
                R[t.id] = t;
                var r = C(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                h(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), h(r)), t;
            }
            function p(e) {
                var t = C(e);
                for (var r in t.arcs) g(r);
                delete w.es[e], delete R[e];
            }
            function y(e) {
                var t = o.createProcess(e, _);
                L[t.id] = t;
                var r = k(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var s in r.arcs) {
                    var c = M[s].port;
                    c && (n.indexOf(c) < 0 || t.ports[c] === o.PORT_TYPES.ACCUMULATOR) && g(s);
                }
                for (var a in t.ports) t.ports[a] === o.PORT_TYPES.ACCUMULATOR && (r.acc = a);
                for (var s in r.arcs) P(M[s]);
                return t;
            }
            function O(e) {
                var t = k(e);
                t.stop && t.stop();
                for (var r in t.arcs) g(r);
                delete w.ps[e], delete L[e];
            }
            function b(e) {
                var t = o.createArc(e);
                M[t.id] = t, P(t);
                var r = k(t.process), n = L[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && j(r), 
                t;
            }
            function g(e) {
                var t = M[e];
                if (t) {
                    var r = k(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete M[e];
            }
            function P(e) {
                var t = e.process, r = e.entity, n = k(t), s = C(r), c = L[t];
                s.arcs[e.id] = !0, c && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = s, c.ports[e.port] == o.PORT_TYPES.HOT ? s.effects[t] = n : delete s.effects[t]) : (n.sink = function(e) {
                    s.val = e, h(s), E();
                }, n.out = s, n.acc ? (n.sources[n.acc] = s, s.reactions[t] = n) : delete s.reactions[t]));
            }
            function T(e) {
                if (e.entities) for (var t in e.entities) d(e.entities[t]);
                if (e.processes) for (var t in e.processes) y(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) b(e.arcs[t]);
                e.meta && c(e.meta), E();
            }
            function h(e, t) {
                D[e.id] = t || !0;
            }
            function x(e) {
                var t = e.syncSchedule, r = e.asyncSchedule, n = e.callbacks, o = e.activeEntities, s = e.eE, c = e.level, a = void 0 === c ? 0 : c, i = e.pLast;
                if (o[s.id] = !0, s.cb && (n[s.id] = s), !i || !i.acc) {
                    var u = !1;
                    for (var l in s.reactions) u = !0, t[l] ? t[l].level < a && (t[l].level = a) : t[l] = {
                        level: a,
                        eP: s.reactions[l]
                    };
                    u && a++;
                }
                for (var l in s.effects) {
                    var f = s.effects[l];
                    if (f.async) r[l] = f; else {
                        if (f.acc && f.out && null == f.out.val) continue;
                        t[l] ? t[l].level < a && (t[l].level = a) : t[l] = {
                            level: a,
                            eP: f
                        }, f.out && x({
                            syncSchedule: t,
                            asyncSchedule: r,
                            callbacks: n,
                            activeEntities: o,
                            eE: f.out,
                            level: a + 1,
                            pLast: f
                        });
                    }
                }
            }
            function E() {
                Y && console.log("flushing graph with", D);
                var e = [], t = {}, r = {}, n = {}, o = {};
                for (var s in D) x({
                    syncSchedule: r,
                    asyncSchedule: n,
                    callbacks: t,
                    activeEntities: o,
                    eE: w.es[s],
                    level: 0,
                    pLast: D[s]
                });
                D = {};
                for (var s in r) {
                    var c = r[s];
                    e[c.level] ? e[c.level].push(c.eP) : e[c.level] = [ c.eP ];
                }
                for (var a = 0; a < e.length; a++) for (var i = 0; i < e[a].length; i++) m(e[a][i], o);
                for (var s in t) t[s].cb(t[s].val);
                for (var u in n) m(n[u], o);
            }
            function m(e, t) {
                Y && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = L[e.id].procedure.call(_, e.values, e.sink); else {
                    var o = L[e.id].procedure.call(_, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function j(e) {
                e.async ? setTimeout(function() {
                    m(e);
                }, 10) : (m(e), h(e.out));
            }
            function S(e) {
                var t = k(e);
                m(t), t.out && !t.async && (h(t.out, t), E());
            }
            function A(e) {
                var t = k(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return R[e] || d({
                    id: e
                }), w.es[e] || (w.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function k(e) {
                return w.ps[e] || (w.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var R = {}, L = {}, M = {}, U = {}, _ = null, w = {
                es: {},
                ps: {}
            }, Y = !1, D = {};
            return {
                addEntity: d,
                removeEntity: p,
                addProcess: y,
                removeProcess: O,
                addArc: b,
                removeArc: g,
                addGraph: T,
                getGraph: e,
                getState: t,
                setMeta: c,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: i,
                set: u,
                update: l,
                on: f,
                off: v,
                start: S,
                stop: A,
                PORT_TYPES: Object.assign({}, o.PORT_TYPES)
            };
        }
        var o = r(2);
        t.create = n;
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? c.v4() : t, n = e.value, o = e.json, s = e.isEvent, a = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: s,
                meta: Object.assign({}, a)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? c.v4() : r, o = e.ports, s = void 0 === o ? {} : o, i = e.procedure, u = e.code, l = e.autostart, f = e.async, v = e.meta;
            return null == u && (u = i.toString()), null == i && (i = a.evaluate(u, t)), {
                id: n,
                ports: s,
                procedure: i,
                code: u,
                autostart: l,
                async: f,
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
        var c = r(3), a = r(4);
        t.createEntity = n, t.createProcess = o, t.createArc = s, t.PORT_TYPES = {
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
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        for (var o = new Array(16), s = function() {
            for (var e, t = 0; 16 > t; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, c = [], a = {}, i = 0; 256 > i; i++) c[i] = (i + 256).toString(16).substr(1), 
        a[c[i]] = i;
        t.v4 = n;
    }, function(module, exports) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        exports.evaluate = evaluate;
    } ]);
});