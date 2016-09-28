!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.tvsFlow = t() : e.tvsFlow = t();
}(this, function() {
    return function(e) {
        function t(n) {
            if (r[n]) return r[n].exports;
            var s = r[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return e[n].call(s.exports, s, s.exports, t), s.loaded = !0, s.exports;
        }
        var r = {};
        return t.m = e, t.c = r, t.p = "", t(0);
    }([ function(e, t, r) {
        "use strict";
        function n(e) {
            for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
        }
        var s = r(1), o = r(5);
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t["default"] = s, t.runtime = s, n(r(1)), t.utils = {
            entitySpec: o
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: L,
                    processes: R,
                    arcs: U,
                    meta: M
                };
            }
            function t() {
                var e = {};
                for (var t in _.es) e[t] = _.es[t].val;
                return e;
            }
            function r() {
                return w;
            }
            function n(e) {
                w = e;
            }
            function o() {
                return M;
            }
            function c(e) {
                null == e || "object" != typeof e || e instanceof Array || (M = Object.assign({}, M, e));
            }
            function a(e) {
                Y = e;
            }
            function i(e) {
                return _.es[e] && _.es[e].val;
            }
            function u(e, t) {
                var r = C(e);
                r.val = t, b(r), g();
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
            function p(e) {
                var t = s.createEntity(e);
                L[t.id] = t;
                var r = C(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                b(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), b(r)), t;
            }
            function d(e) {
                var t = C(e);
                for (var r in t.arcs) h(r);
                delete _.es[e], delete L[e];
            }
            function y(e) {
                var t = s.createProcess(e, w);
                R[t.id] = t;
                var r = k(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var c = U[o].port;
                    c && (n.indexOf(c) < 0 || t.ports[c] === s.PORT_TYPES.ACCUMULATOR) && h(o);
                }
                for (var a in t.ports) t.ports[a] === s.PORT_TYPES.ACCUMULATOR && (r.acc = a);
                for (var o in r.arcs) E(U[o]);
                return t;
            }
            function m(e) {
                var t = k(e);
                t.stop && t.stop();
                for (var r in t.arcs) h(r);
                delete _.ps[e], delete R[e];
            }
            function O(e) {
                var t = s.createArc(e);
                U[t.id] = t, E(t);
                var r = k(t.process), n = R[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && j(r), 
                t;
            }
            function h(e) {
                var t = U[e];
                if (t) {
                    var r = k(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete U[e];
            }
            function E(e) {
                var t = e.process, r = e.entity, n = k(t), o = C(r), c = R[t];
                o.arcs[e.id] = !0, c && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, c.ports[e.port] == s.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, b(o), g();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function T(e) {
                if (e.entities) for (var t in e.entities) p(e.entities[t]);
                if (e.processes) for (var t in e.processes) y(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) O(e.arcs[t]);
                e.meta && c(e.meta), g();
            }
            function b(e, t) {
                H[e.id] = t || !0;
            }
            function P(e) {
                var t = e.syncSchedule, r = e.asyncSchedule, n = e.callbacks, s = e.activeEntities, o = e.eE, c = e.level, a = void 0 === c ? 0 : c, i = e.pLast;
                if (s[o.id] = !0, o.cb && (n[o.id] = o), !i || !i.acc) {
                    var u = !1;
                    for (var l in o.reactions) u = !0, t[l] ? t[l].level < a && (t[l].level = a) : t[l] = {
                        level: a,
                        eP: o.reactions[l]
                    };
                    u && a++;
                }
                for (var l in o.effects) {
                    var f = o.effects[l];
                    if (f.async) r[l] = f; else {
                        if (f.acc && f.out && null == f.out.val) continue;
                        t[l] ? t[l].level < a && (t[l].level = a) : t[l] = {
                            level: a,
                            eP: f
                        }, f.out && P({
                            syncSchedule: t,
                            asyncSchedule: r,
                            callbacks: n,
                            activeEntities: s,
                            eE: f.out,
                            level: a + 1,
                            pLast: f
                        });
                    }
                }
            }
            function g() {
                Y && console.log("flushing graph with", H);
                var e = [], t = {}, r = {}, n = {}, s = {};
                for (var o in H) P({
                    syncSchedule: r,
                    asyncSchedule: n,
                    callbacks: t,
                    activeEntities: s,
                    eE: _.es[o],
                    level: 0,
                    pLast: H[o]
                });
                H = {};
                for (var o in r) {
                    var c = r[o];
                    e[c.level] ? e[c.level].push(c.eP) : e[c.level] = [ c.eP ];
                }
                for (var a = 0; a < e.length; a++) for (var i = 0; i < e[a].length; i++) x(e[a][i], s);
                for (var o in t) t[o].cb(t[o].val);
                for (var u in n) x(n[u], s);
            }
            function x(e, t) {
                Y && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = R[e.id].procedure.call(w, e.values, e.sink); else {
                    var s = R[e.id].procedure.call(w, e.values);
                    e.out && (e.out.val = s);
                }
            }
            function j(e) {
                e.async ? setTimeout(function() {
                    x(e);
                }, 10) : (x(e), b(e.out));
            }
            function S(e) {
                var t = k(e);
                x(t), t.out && !t.async && (b(t.out, t), g());
            }
            function A(e) {
                var t = k(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return L[e] || p({
                    id: e
                }), _.es[e] || (_.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function k(e) {
                return _.ps[e] || (_.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var L = {}, R = {}, U = {}, M = {}, w = null, _ = {
                es: {},
                ps: {}
            }, Y = !1, H = {};
            return {
                addEntity: p,
                removeEntity: d,
                addProcess: y,
                removeProcess: m,
                addArc: O,
                removeArc: h,
                addGraph: T,
                getGraph: e,
                getState: t,
                setMeta: c,
                getMeta: o,
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
                PORT_TYPES: Object.assign({}, s.PORT_TYPES)
            };
        }
        var s = r(2);
        t.create = n;
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? c.v4() : t, n = e.value, s = e.json, o = e.isEvent, a = e.meta;
            return {
                id: r,
                value: n,
                json: s,
                isEvent: o,
                meta: Object.assign({}, a)
            };
        }
        function s(e, t) {
            var r = e.id, n = void 0 === r ? c.v4() : r, s = e.ports, o = void 0 === s ? {} : s, i = e.procedure, u = e.code, l = e.autostart, f = e.async, v = e.meta;
            if (null == i && null != u && (i = a.evaluate(u, t)), null == u && i && (u = i.toString()), 
            null == u || null == i) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: o,
                procedure: i,
                code: u,
                autostart: l,
                async: f,
                meta: Object.assign({}, v)
            };
        }
        function o(e) {
            var t = e.id, r = e.entity, n = e.process, s = e.port, o = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == s ? n + "->" + r : r + "->" + n + "::" + s), {
                id: t,
                entity: r,
                process: n,
                port: s,
                meta: Object.assign({}, o)
            };
        }
        var c = r(3), a = r(4);
        t.createEntity = n, t.createProcess = s, t.createArc = o, t.PORT_TYPES = {
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
            var e = o();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        for (var s = new Array(16), o = function() {
            for (var e, t = 0; 16 > t; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            s[t] = e >>> ((3 & t) << 3) & 255;
            return s;
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
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = e.split(" "), r = t[0], n = t[1], s = l[r.toUpperCase()];
            return {
                type: s,
                eid: n
            };
        }
        function n(e, t) {
            return t + "." + e;
        }
        function s(e, t, s) {
            s && (e = n(e, s));
            var o = e + u, c = {
                id: o,
                procedure: t["do"]
            }, a = {
                entities: [],
                processes: [ c ],
                arcs: [ {
                    process: o,
                    entity: e
                } ]
            };
            if (t.autostart && (c.autostart = t.autostart), t.async && (c.async = t.async), 
            t.meta && (c.meta = t.meta), t.deps) {
                c.ports = {};
                for (var i in t.deps) {
                    var l = r(t.deps[i]);
                    if (c.ports[i] = l.type, l.eid) {
                        if (0 === l.eid.indexOf("#")) {
                            var f = l.eid.substr(1);
                            l.eid = s ? n(f, s) : f;
                        }
                        a.arcs.push({
                            entity: l.eid,
                            process: o,
                            port: i
                        });
                    }
                }
            }
            return a;
        }
        function o() {
            return {
                entities: [],
                processes: [],
                arcs: []
            };
        }
        function c(e, t) {
            return {
                entities: e.entities.concat(t.entities),
                processes: e.processes.concat(t.processes),
                arcs: e.arcs.concat(t.arcs)
            };
        }
        function a(e, t, r) {
            var a = o(), i = r ? n(e, r) : e, u = {
                id: i
            };
            return null != t.val && (u.value = t.val), t.json && (u.json = t.json), t.isEvent && (u.isEvent = t.isEvent), 
            t.meta && (u.meta = t.meta), t.stream && (a = c(a, s(e, t.stream, r))), t.streams && (a = t.streams.map(function(t) {
                return s(e, t, r);
            }).map(function(e, t) {
                return e.processes[0].id += t + 1, e.arcs.forEach(function(e) {
                    return e.process += t + 1;
                }), e;
            }).reduce(c, a)), a.entities.push(u), a;
        }
        function i(e, t) {
            return Object.keys(e).map(function(r) {
                return a(r, e[r], t);
            }).reduce(c, o());
        }
        var u = "Stream", l = {
            H: "HOT",
            C: "COLD",
            A: "ACCUMULATOR"
        };
        t.processProcessSpec = s, t.processEntitySpec = a, t.toGraph = i;
    } ]);
});