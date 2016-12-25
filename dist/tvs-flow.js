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
        var i = n(o), s = r(5), a = n(s), c = r(6), u = n(c), f = r(2), l = n(f);
        t.default = i;
        t.runtime = i, t.types = l, t.utils = {
            entitySpec: a,
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
            function c(e) {
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
            function d(e) {
                var t = w(e);
                delete t.cb;
            }
            function p(e) {
                var t = a.createEntity(e);
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
                var t = a.createProcess(e, Y);
                M[t.id] = t;
                var r = C(t.id);
                delete r.acc, r.values = Array.isArray(t.ports) ? [] : {}, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var i = L[o].port;
                    i && (n.indexOf(i) < 0 || t.ports[i] === a.PORT_TYPES.ACCUMULATOR) && T(o);
                }
                for (var s in t.ports) t.ports[s] === a.PORT_TYPES.ACCUMULATOR && (r.acc = s);
                for (var c in r.arcs) h(L[c]);
                return t;
            }
            function m(e) {
                var t = C(e);
                t.stop && t.stop();
                for (var r in t.arcs) T(r);
                delete k.ps[e], delete M[e];
            }
            function P(e) {
                var t = a.createArc(e);
                L[t.id] = t, h(t);
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
            function h(e) {
                var t = e.process, r = e.entity, n = C(t), o = w(r), i = M[t];
                o.arcs[e.id] = !0, i && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, i.ports[e.port] == a.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, E(o), q ? z = !0 : S();
                }, n.out = o, null != n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function b(e) {
                if (e.entities) for (var t in e.entities) p(e.entities[t]);
                if (e.processes) for (var r in e.processes) O(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) P(e.arcs[n]);
                e.meta && s(e.meta);
            }
            function E(e, t) {
                D[e.id] = t || !0;
            }
            function j(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = arguments[2];
                if (N[e.id] = !0, e.cb && (I[e.id] = e), !r || null == r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var i in e.effects) {
                    var s = e.effects[i];
                    if (s.async) J[i] = s; else {
                        if (null != s.acc && s.out && null == s.out.val) continue;
                        G[i] ? G[i].level < t && (G[i].level = t) : G[i] = {
                            level: t,
                            eP: s
                        }, s.out && j(s.out, t + 1, s);
                    }
                }
            }
            function S() {
                H && console.log("flushing graph with", D), N = {}, G = {}, J = {}, I = {};
                for (var e in D) j(k.es[e], 0, D[e]);
                D = {};
                for (var t in G) {
                    var r = G[t];
                    F[r.level] ? F[r.level].push(r.eP) : F[r.level] = [ r.eP ];
                }
                for (var n = 0; n < F.length; n++) for (var o = 0; o < F[n].length; o++) _(F[n][o], N);
                F.length = 0;
                for (var i in I) I[i].cb(I[i].val);
                q = !0, z = !1;
                for (var s in J) _(J[s], N);
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
                return R[e] || p({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function C(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
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
                addEntity: p,
                removeEntity: y,
                addProcess: O,
                removeProcess: m,
                addArc: P,
                removeArc: T,
                addGraph: b,
                getGraph: e,
                getState: t,
                setMeta: s,
                getMeta: o,
                getContext: r,
                setContext: n,
                setDebug: c,
                get: u,
                set: f,
                update: l,
                on: v,
                off: d,
                start: x,
                stop: A,
                flush: S,
                PORT_TYPES: Object.assign({}, a.PORT_TYPES)
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
        var s = r(2), a = n(s);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, s.v4)() : t, n = e.value, o = e.json, i = e.isEvent, a = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: i,
                meta: Object.assign({}, a)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, s.v4)() : r, o = e.ports, i = void 0 === o ? {} : o, c = e.procedure, u = e.code, f = e.autostart, l = void 0 !== f && f, v = e.async, d = void 0 !== v && v, p = e.meta;
            if (null == c && null != u && (c = (0, a.evaluate)(u, t)), null == u && c && (u = c.toString()), 
            null == u || null == c) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: i,
                procedure: c,
                code: u,
                autostart: l,
                async: d,
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
        var s = r(3), a = r(4);
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
        }, s = [], a = {}, c = 0; c < 256; c++) s[c] = (c + 256).toString(16).substr(1), 
        a[s[c]] = c;
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
            var t = e.split(" "), r = l(t, 2), n = r[0], o = r[1], i = p[n.toUpperCase()];
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
                for (var s = t.trim().split("."), a = 0; a < n - 1; a++) s.pop();
                return t = s.join("."), o(i, t);
            }
            return i;
        }
        function s(e, t, r) {
            e = o(e, r);
            var s = t.id || e + d, a = {
                id: s,
                procedure: t.do
            }, c = {
                entities: [],
                processes: [ a ],
                arcs: [ {
                    process: s,
                    entity: e
                } ]
            };
            if (t.autostart && (a.autostart = t.autostart), t.async && (a.async = t.async), 
            t.meta && (a.meta = t.meta), t.with) {
                a.ports = {};
                for (var u in t.with) {
                    var f = n(t.with[u]);
                    a.ports[u] = f.type, f.eid && (0 === f.eid.indexOf(".") && (f.eid = i(f.eid, r)), 
                    c.arcs.push({
                        entity: f.eid,
                        process: s,
                        port: u
                    }));
                }
            }
            return c;
        }
        function a() {
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
        function u(e, t, r) {
            var n = a(), i = o(e, r), u = {
                id: i
            };
            return null != t.val && (u.value = t.val), t.json && (u.json = t.json), t.isEvent && (u.isEvent = t.isEvent), 
            t.meta && (u.meta = t.meta), t.stream && (n = c(n, s(e, t.stream, r))), t.streams && (n = t.streams.map(function(t) {
                return s(e, t, r);
            }).map(function(e, t) {
                return e.processes[0].id += t + 1, e.arcs.forEach(function(e) {
                    return e.process += t + 1;
                }), e;
            }).reduce(c, n)), n.entities.push(u), n;
        }
        function f(e, t) {
            return Object.keys(e).map(function(r) {
                return u(r, e[r], t);
            }).reduce(c, a());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var l = function() {
            function e(e, t) {
                var r = [], n = !0, o = !1, i = void 0;
                try {
                    for (var s, a = e[Symbol.iterator](); !(n = (s = a.next()).done) && (r.push(s.value), 
                    !t || r.length !== t); n = !0) ;
                } catch (e) {
                    o = !0, i = e;
                } finally {
                    try {
                        !n && a.return && a.return();
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
        var v = r(2), d = "Stream", p = {
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
                        json: a,
                        isEvent: c
                    });
                }
                var n, a, c, u = [], f = {};
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
                    return a = e, r(), f;
                }, f.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return c = e, r(), f;
                }, f.stream = function(t) {
                    return f.onId(function(r) {
                        var n = t.do, i = t.id || r + s, a = void 0;
                        if (t.with) {
                            a = {};
                            for (var c in t.with) {
                                var u = t.with[c];
                                a[c] = u.type;
                            }
                        }
                        if (e.addProcess({
                            id: i,
                            procedure: n,
                            ports: a,
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