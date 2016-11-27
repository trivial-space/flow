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
        var i = n(o), s = r(5), c = n(s), a = r(6), u = n(a), f = r(2), l = n(f);
        t.default = i;
        t.runtime = i, t.types = l, t.utils = {
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
                    entities: R,
                    processes: M,
                    arcs: L,
                    meta: U
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
                return U;
            }
            function s(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : i(e)) || e instanceof Array || (U = Object.assign({}, U, e));
            }
            function a(e) {
                H = e;
            }
            function u(e) {
                return k.es[e] && k.es[e].val;
            }
            function f(e, t) {
                var r = w(e);
                r.val = t, E(r), S();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function v(e, t) {
                var r = w(e);
                r.cb = t;
            }
            function p(e) {
                var t = w(e);
                delete t.cb;
            }
            function d(e) {
                var t = c.createEntity(e);
                R[t.id] = t;
                var r = w(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                E(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), E(r)), t;
            }
            function y(e) {
                var t = w(e);
                for (var r in t.arcs) T(r);
                delete k.es[e], delete R[e];
            }
            function O(e) {
                var t = c.createProcess(e, Y);
                M[t.id] = t;
                var r = C(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var i = L[o].port;
                    i && (n.indexOf(i) < 0 || t.ports[i] === c.PORT_TYPES.ACCUMULATOR) && T(o);
                }
                for (var s in t.ports) t.ports[s] === c.PORT_TYPES.ACCUMULATOR && (r.acc = s);
                for (var o in r.arcs) b(L[o]);
                return t;
            }
            function m(e) {
                var t = C(e);
                t.stop && t.stop();
                for (var r in t.arcs) T(r);
                delete k.ps[e], delete M[e];
            }
            function P(e) {
                var t = c.createArc(e);
                L[t.id] = t, b(t);
                var r = C(t.process), n = M[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && g(r), 
                t;
            }
            function T(e) {
                var t = L[e];
                if (t) {
                    var r = C(t.process), n = w(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete L[e];
            }
            function b(e) {
                var t = e.process, r = e.entity, n = C(t), o = w(r), i = M[t];
                o.arcs[e.id] = !0, i && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, i.ports[e.port] == c.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, E(o), q ? z = !0 : S();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) d(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) P(e.arcs[t]);
                e.meta && s(e.meta);
            }
            function E(e, t) {
                D[e.id] = t || !0;
            }
            function j(e, t, r) {
                if (void 0 === t && (t = 0), N[e.id] = !0, e.cb && (I[e.id] = e), !r || !r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var o in e.effects) {
                    var i = e.effects[o];
                    if (i.async) J[o] = i; else {
                        if (i.acc && i.out && null == i.out.val) continue;
                        G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                            level: t,
                            eP: i
                        }, i.out && j(i.out, t + 1, i);
                    }
                }
            }
            function S() {
                H && console.log("flushing graph with", D), N = {}, G = {}, J = {}, I = {};
                for (var e in D) j(k.es[e], 0, D[e]);
                D = {};
                for (var e in G) {
                    var t = G[e];
                    F[t.level] ? F[t.level].push(t.eP) : F[t.level] = [ t.eP ];
                }
                for (var r = 0; r < F.length; r++) for (var n = 0; n < F[r].length; n++) _(F[r][n], N);
                F.length = 0;
                for (var e in I) I[e].cb(I[e].val);
                q = !0, z = !1;
                for (var o in J) _(J[o], N);
                q = !1, z && S();
            }
            function _(e, t) {
                H && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = M[e.id].procedure.call(Y, e.values, e.sink); else {
                    var o = M[e.id].procedure.call(Y, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function g(e) {
                e.async ? setTimeout(function() {
                    _(e);
                }, 10) : (_(e), E(e.out));
            }
            function x(e) {
                var t = C(e);
                _(t), t.out && !t.async && (E(t.out, t), S());
            }
            function A(e) {
                var t = C(e);
                t.stop && t.stop(), delete t.stop;
            }
            function w(e) {
                return R[e] || d({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function C(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var R = {}, M = {}, L = {}, U = {}, Y = null, k = {
                es: {},
                ps: {}
            }, H = !1, D = {}, F = [], I = {}, G = {}, J = {}, N = {}, q = !1, z = !1;
            return {
                addEntity: d,
                removeEntity: y,
                addProcess: O,
                removeProcess: m,
                addArc: P,
                removeArc: T,
                addGraph: h,
                getGraph: e,
                getState: t,
                setMeta: s,
                getMeta: o,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: u,
                set: f,
                update: l,
                on: v,
                off: p,
                start: x,
                stop: A,
                flush: S,
                PORT_TYPES: Object.assign({}, c.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        };
        t.create = o;
        var s = r(2), c = n(s);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, s.v4)() : t, n = e.value, o = e.json, i = e.isEvent, c = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: i,
                meta: Object.assign({}, c)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, s.v4)() : r, o = e.ports, i = void 0 === o ? {} : o, a = e.procedure, u = e.code, f = e.autostart, l = void 0 !== f && f, v = e.async, p = void 0 !== v && v, d = e.meta;
            if (null == a && null != u && (a = (0, c.evaluate)(u, t)), null == u && a && (u = a.toString()), 
            null == u || null == a) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: i,
                procedure: a,
                code: u,
                autostart: l,
                async: p,
                meta: Object.assign({}, d)
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
        var s = r(3), c = r(4);
        t.PORT_TYPES = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = 0, r = s;
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
        }, s = [], c = {}, a = 0; a < 256; a++) s[a] = (a + 256).toString(16).substr(1), 
        c[s[a]] = a;
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
            var t = e.split(" "), r = l(t, 2), n = r[0], o = r[1], i = d[n.toUpperCase()];
            return {
                type: i,
                eid: o
            };
        }
        function o(e, t) {
            return t ? t + "." + e : e;
        }
        function i(e, t) {
            var r = /^\.*/.exec(e), n = r ? r[0].length : 0, i = e.substr(n);
            if (t) {
                for (var s = t.trim().split("."), c = 0; c < n - 1; c++) s.pop();
                return t = s.join("."), o(i, t);
            }
            return i;
        }
        function s(e, t, r) {
            e = o(e, r);
            var s = t.id || e + p, c = {
                id: s,
                procedure: t.do
            }, a = {
                entities: [],
                processes: [ c ],
                arcs: [ {
                    process: s,
                    entity: e
                } ]
            };
            if (t.autostart && (c.autostart = t.autostart), t.async && (c.async = t.async), 
            t.meta && (c.meta = t.meta), t.with) {
                c.ports = {};
                for (var u in t.with) {
                    var f = n(t.with[u]);
                    c.ports[u] = f.type, f.eid && (0 === f.eid.indexOf(".") && (f.eid = i(f.eid, r)), 
                    a.arcs.push({
                        entity: f.eid,
                        process: s,
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
            var n = c(), i = o(e, r), u = {
                id: i
            };
            return null != t.val && (u.value = t.val), t.json && (u.json = t.json), t.isEvent && (u.isEvent = t.isEvent), 
            t.meta && (u.meta = t.meta), t.stream && (n = a(n, s(e, t.stream, r))), t.streams && (n = t.streams.map(function(t) {
                return s(e, t, r);
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
                var r = [], n = !0, o = !1, i = void 0;
                try {
                    for (var s, c = e[Symbol.iterator](); !(n = (s = c.next()).done) && (r.push(s.value), 
                    !t || r.length !== t); n = !0) ;
                } catch (e) {
                    o = !0, i = e;
                } finally {
                    try {
                        !n && c.return && c.return();
                    } finally {
                        if (o) throw i;
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
        t.processProcessSpec = s, t.processEntitySpec = u, t.toGraph = f;
        var v = r(2), p = "Stream", d = {
            H: v.PORT_TYPES.HOT,
            C: v.PORT_TYPES.COLD,
            A: v.PORT_TYPES.ACCUMULATOR
        };
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            function t(t) {
                function r() {
                    n && e.addEntity({
                        id: n,
                        value: t,
                        json: c,
                        isEvent: a
                    });
                }
                var n, c, a, u = [], f = {};
                return f.HOT = {
                    type: i.PORT_TYPES.HOT,
                    entity: f
                }, f.COLD = {
                    type: i.PORT_TYPES.COLD,
                    entity: f
                }, f.SELF = o, f.getId = function() {
                    return n;
                }, f.onId = function(e) {
                    u.push(e), n && e(n);
                }, f.id = function(t) {
                    return n && n != t && e.removeEntity(n), n = t, r(), u.forEach(function(e) {
                        return e(n);
                    }), f;
                }, f.value = function(e) {
                    return t = e, r(), f;
                }, f.json = function(e) {
                    return c = e, r(), f;
                }, f.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return a = e, r(), f;
                }, f.stream = function(t) {
                    return f.onId(function(r) {
                        var n = t.do, i = t.id || r + s, c = void 0;
                        if (t.with) {
                            c = {};
                            for (var a in t.with) {
                                var u = t.with[a];
                                c[a] = u.type;
                            }
                        }
                        if (e.addProcess({
                            id: i,
                            procedure: n,
                            ports: c,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: i,
                            entity: r
                        }), t.with) {
                            var f = function(r) {
                                var n = t.with[r];
                                n.type !== o.type && n.entity.onId(function(t) {
                                    e.addArc({
                                        entity: t,
                                        process: i,
                                        port: r
                                    });
                                });
                            };
                            for (var l in t.with) f(l);
                        }
                    }), f;
                }, f;
            }
            function r(e, t) {
                for (var r in e) {
                    var o = e[r];
                    if ("function" == typeof o.id && o.HOT && o.COLD && o.SELF) {
                        var i = n(r, t);
                        o.id(i);
                    }
                }
            }
            var o = {
                type: i.PORT_TYPES.ACCUMULATOR
            };
            return t.SELF = o, {
                entity: t,
                addToFlow: r,
                SELF: o
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = o;
        var i = r(2), s = "Stream";
    } ]);
});