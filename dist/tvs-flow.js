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
                    entities: w,
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
            function i(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : s(e)) || e instanceof Array || (U = Object.assign({}, U, e));
            }
            function a(e) {
                H = e;
            }
            function u(e) {
                return k.es[e] && k.es[e].val;
            }
            function f(e, t) {
                var r = C(e);
                r.val = t, E(r), _();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function v(e, t) {
                var r = C(e);
                r.cb = t;
            }
            function p(e) {
                var t = C(e);
                delete t.cb;
            }
            function d(e) {
                var t = c.createEntity(e);
                w[t.id] = t;
                var r = C(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                E(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), E(r)), t;
            }
            function y(e) {
                var t = C(e);
                for (var r in t.arcs) T(r);
                delete k.es[e], delete w[e];
            }
            function O(e) {
                var t = c.createProcess(e, Y);
                M[t.id] = t;
                var r = R(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var s = L[o].port;
                    s && (n.indexOf(s) < 0 || t.ports[s] === c.PORT_TYPES.ACCUMULATOR) && T(o);
                }
                for (var i in t.ports) t.ports[i] === c.PORT_TYPES.ACCUMULATOR && (r.acc = i);
                for (var o in r.arcs) b(L[o]);
                return t;
            }
            function m(e) {
                var t = R(e);
                t.stop && t.stop();
                for (var r in t.arcs) T(r);
                delete k.ps[e], delete M[e];
            }
            function P(e) {
                var t = c.createArc(e);
                L[t.id] = t, b(t);
                var r = R(t.process), n = M[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && g(r), 
                t;
            }
            function T(e) {
                var t = L[e];
                if (t) {
                    var r = R(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete L[e];
            }
            function b(e) {
                var t = e.process, r = e.entity, n = R(t), o = C(r), s = M[t];
                o.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, s.ports[e.port] == c.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, E(o), q ? z = !0 : _();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) d(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) P(e.arcs[t]);
                e.meta && i(e.meta);
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
                    var s = e.effects[o];
                    if (s.async) J[o] = s; else {
                        if (s.acc && s.out && null == s.out.val) continue;
                        G[o] ? G[o].level < t && (G[o].level = t) : G[o] = {
                            level: t,
                            eP: s
                        }, s.out && j(s.out, t + 1, s);
                    }
                }
            }
            function _() {
                H && console.log("flushing graph with", D), N = {}, G = {}, J = {}, I = {};
                for (var e in D) j(k.es[e], 0, D[e]);
                D = {};
                for (var e in G) {
                    var t = G[e];
                    F[t.level] ? F[t.level].push(t.eP) : F[t.level] = [ t.eP ];
                }
                for (var r = 0; r < F.length; r++) for (var n = 0; n < F[r].length; n++) S(F[r][n], N);
                F.length = 0;
                for (var e in I) I[e].cb(I[e].val);
                q = !0, z = !1;
                for (var o in J) S(J[o], N);
                q = !1, z && _();
            }
            function S(e, t) {
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
                    S(e);
                }, 10) : (S(e), E(e.out));
            }
            function x(e) {
                var t = R(e);
                S(t), t.out && !t.async && (E(t.out, t), _());
            }
            function A(e) {
                var t = R(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return w[e] || d({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function R(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var w = {}, M = {}, L = {}, U = {}, Y = null, k = {
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
                setMeta: i,
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
                flush: _,
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
            var r = e.id, n = void 0 === r ? (0, i.v4)() : r, o = e.ports, s = void 0 === o ? {} : o, a = e.procedure, u = e.code, f = e.autostart, l = e.async, v = e.meta;
            if (null == a && null != u && (a = (0, c.evaluate)(u, t)), null == u && a && (u = a.toString()), 
            null == u || null == a) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: s,
                procedure: a,
                code: u,
                autostart: f,
                async: !!l,
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
            var t = e.split(" "), r = t[0], n = t[1], o = p[r.toUpperCase()];
            return {
                type: o,
                eid: n
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
            var i = t.id || e + v, c = {
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
        }), t.processProcessSpec = i, t.processEntitySpec = u, t.toGraph = f;
        var l = r(2), v = "Stream", p = {
            H: l.PORT_TYPES.HOT,
            C: l.PORT_TYPES.COLD,
            A: l.PORT_TYPES.ACCUMULATOR
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
                    type: s.PORT_TYPES.HOT,
                    entity: f
                }, f.COLD = {
                    type: s.PORT_TYPES.COLD,
                    entity: f
                }, f.getId = function() {
                    return n;
                }, f.onId = function(e) {
                    u.push(e), n && e(n);
                }, f.id = function(t) {
                    return n && e.removeEntity(n), n = t, r(), u.forEach(function(e) {
                        return e(n);
                    }), f;
                }, f.value = function(e) {
                    return t = e, r(), f;
                }, f.json = function(e) {
                    return c = e, r(), f;
                }, f.isEvent = function(e) {
                    return void 0 === e && (e = !0), a = e, r(), f;
                }, f.stream = function(t) {
                    return f.onId(function(r) {
                        var n, s = t.do, c = t.id || r + i;
                        if (t.with) {
                            n = {};
                            for (var a in t.with) {
                                var u = t.with[a];
                                n[a] = u.type;
                            }
                        }
                        if (e.addProcess({
                            id: c,
                            procedure: s,
                            ports: n,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: c,
                            entity: r
                        }), t.with) {
                            var f = function(r) {
                                var n = t.with[r];
                                n.type !== o.type && n.entity.onId(function(t) {
                                    e.addArc({
                                        entity: t,
                                        process: c,
                                        port: r
                                    });
                                });
                            };
                            for (var a in t.with) f(a);
                        }
                    }), f;
                }, f;
            }
            function r(e, t) {
                for (var r in e) {
                    var o = n(r, t), s = e[r];
                    s.id(o);
                }
            }
            var o = {
                type: s.PORT_TYPES.ACCUMULATOR
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
        var s = r(2), i = "Stream";
    } ]);
});