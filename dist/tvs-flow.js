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
            return t["default"] = e, t;
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.utils = t.types = t.runtime = void 0;
        var o = r(1);
        Object.keys(o).forEach(function(e) {
            "default" !== e && Object.defineProperty(t, e, {
                enumerable: !0,
                get: function() {
                    return o[e];
                }
            });
        });
        var s = n(o), c = r(5), i = n(c), a = r(2), u = n(a);
        t["default"] = s;
        t.runtime = s, t.types = u, t.utils = {
            entitySpec: i
        };
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t["default"] = e, t;
        }
        function o(e) {
            return e && "undefined" != typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e;
        }
        function s() {
            function e() {
                return {
                    entities: w,
                    processes: R,
                    arcs: U,
                    meta: k
                };
            }
            function t() {
                var e = {};
                for (var t in Y.es) e[t] = Y.es[t].val;
                return e;
            }
            function r() {
                return L;
            }
            function n(e) {
                L = e;
            }
            function s() {
                return k;
            }
            function c(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : o(e)) || e instanceof Array || (k = Object.assign({}, k, e));
            }
            function a(e) {
                H = e;
            }
            function u(e) {
                return Y.es[e] && Y.es[e].val;
            }
            function f(e, t) {
                var r = S(e);
                r.val = t, T(r), x();
            }
            function l(e, t) {
                f(e, t(u(e)));
            }
            function v(e, t) {
                var r = S(e);
                r.cb = t;
            }
            function p(e) {
                var t = S(e);
                delete t.cb;
            }
            function d(e) {
                var t = i.createEntity(e);
                w[t.id] = t;
                var r = S(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                T(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), T(r)), t;
            }
            function y(e) {
                var t = S(e);
                for (var r in t.arcs) P(r);
                delete Y.es[e], delete w[e];
            }
            function O(e) {
                var t = i.createProcess(e, L);
                R[t.id] = t;
                var r = M(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var s = U[o].port;
                    s && (n.indexOf(s) < 0 || t.ports[s] === i.PORT_TYPES.ACCUMULATOR) && P(o);
                }
                for (var c in t.ports) t.ports[c] === i.PORT_TYPES.ACCUMULATOR && (r.acc = c);
                for (var o in r.arcs) j(U[o]);
                return t;
            }
            function m(e) {
                var t = M(e);
                t.stop && t.stop();
                for (var r in t.arcs) P(r);
                delete Y.ps[e], delete R[e];
            }
            function b(e) {
                var t = i.createArc(e);
                U[t.id] = t, j(t);
                var r = M(t.process), n = R[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && _(r), 
                t;
            }
            function P(e) {
                var t = U[e];
                if (t) {
                    var r = M(t.process), n = S(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete U[e];
            }
            function j(e) {
                var t = e.process, r = e.entity, n = M(t), o = S(r), s = R[t];
                o.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, s.ports[e.port] == i.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, T(o), z ? B = !0 : x();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) d(e.entities[t]);
                if (e.processes) for (var t in e.processes) O(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) b(e.arcs[t]);
                e.meta && c(e.meta), x();
            }
            function T(e, t) {
                D[e.id] = t || !0;
            }
            function g(e, t, r) {
                if (void 0 === t && (t = 0), q[e.id] = !0, e.cb && (F[e.id] = e), !r || !r.acc) {
                    var n = !1;
                    for (var o in e.reactions) n = !0, J[o] ? J[o].level < t && (J[o].level = t) : J[o] = {
                        level: t,
                        eP: e.reactions[o]
                    };
                    n && t++;
                }
                for (var o in e.effects) {
                    var s = e.effects[o];
                    if (s.async) N[o] = s; else {
                        if (s.acc && s.out && null == s.out.val) continue;
                        J[o] ? J[o].level < t && (J[o].level = t) : J[o] = {
                            level: t,
                            eP: s
                        }, s.out && g(s.out, t + 1, s);
                    }
                }
            }
            function x() {
                H && console.log("flushing graph with", D), q = {}, J = {}, N = {}, F = {};
                for (var e in D) g(Y.es[e], 0, D[e]);
                D = {};
                for (var e in J) {
                    var t = J[e];
                    G[t.level] ? G[t.level].push(t.eP) : G[t.level] = [ t.eP ];
                }
                for (var r = 0; r < G.length; r++) for (var n = 0; n < G[r].length; n++) E(G[r][n], q);
                G.length = 0;
                for (var e in F) F[e].cb(F[e].val);
                z = !0, B = !1;
                for (var o in N) E(N[o], q);
                z = !1, B && x();
            }
            function E(e, t) {
                H && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = R[e.id].procedure.call(L, e.values, e.sink); else {
                    var o = R[e.id].procedure.call(L, e.values);
                    e.out && (e.out.val = o);
                }
            }
            function _(e) {
                e.async ? setTimeout(function() {
                    E(e);
                }, 10) : (E(e), T(e.out));
            }
            function A(e) {
                var t = M(e);
                E(t), t.out && !t.async && (T(t.out, t), x());
            }
            function C(e) {
                var t = M(e);
                t.stop && t.stop(), delete t.stop;
            }
            function S(e) {
                return w[e] || d({
                    id: e
                }), Y.es[e] || (Y.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function M(e) {
                return Y.ps[e] || (Y.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var w = {}, R = {}, U = {}, k = {}, L = null, Y = {
                es: {},
                ps: {}
            }, H = !1, D = {}, G = [], F = {}, J = {}, N = {}, q = {}, z = !1, B = !1;
            return {
                addEntity: d,
                removeEntity: y,
                addProcess: O,
                removeProcess: m,
                addArc: b,
                removeArc: P,
                addGraph: h,
                getGraph: e,
                getState: t,
                setMeta: c,
                getMeta: s,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: u,
                set: f,
                update: l,
                on: v,
                off: p,
                start: A,
                stop: C,
                PORT_TYPES: Object.assign({}, i.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = s;
        var c = r(2), i = n(c);
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id, r = void 0 === t ? (0, c.v4)() : t, n = e.value, o = e.json, s = e.isEvent, i = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                isEvent: s,
                meta: Object.assign({}, i)
            };
        }
        function o(e, t) {
            var r = e.id, n = void 0 === r ? (0, c.v4)() : r, o = e.ports, s = void 0 === o ? {} : o, a = e.procedure, u = e.code, f = e.autostart, l = e.async, v = e.meta;
            if (null == a && null != u && (a = (0, i.evaluate)(u, t)), null == u && a && (u = a.toString()), 
            null == u || null == a) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: s,
                procedure: a,
                code: u,
                autostart: f,
                async: l,
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
        var c = r(3), i = r(4);
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
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, r(e);
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.v4 = n;
        for (var o = new Array(16), s = function() {
            for (var e, t = 0; 16 > t; t++) 0 === (3 & t) && (e = 4294967296 * Math.random()), 
            o[t] = e >>> ((3 & t) << 3) & 255;
            return o;
        }, c = [], i = {}, a = 0; 256 > a; a++) c[a] = (a + 256).toString(16).substr(1), 
        i[c[a]] = a;
    }, function(module, exports) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.evaluate = evaluate;
    }, function(e, t) {
        "use strict";
        function r(e) {
            var t = e.split(" "), r = t[0], n = t[1], o = f[r.toUpperCase()];
            return {
                type: o,
                eid: n
            };
        }
        function n(e, t) {
            return t + "." + e;
        }
        function o(e, t, o) {
            o && (e = n(e, o));
            var s = t.id || e + u, c = {
                id: s,
                procedure: t["do"]
            }, i = {
                entities: [],
                processes: [ c ],
                arcs: [ {
                    process: s,
                    entity: e
                } ]
            };
            if (t.autostart && (c.autostart = t.autostart), t.async && (c.async = t.async), 
            t.meta && (c.meta = t.meta), t["with"]) {
                c.ports = {};
                for (var a in t["with"]) {
                    var f = r(t["with"][a]);
                    if (c.ports[a] = f.type, f.eid) {
                        if (0 === f.eid.indexOf("#")) {
                            var l = f.eid.substr(1);
                            f.eid = o ? n(l, o) : l;
                        }
                        i.arcs.push({
                            entity: f.eid,
                            process: s,
                            port: a
                        });
                    }
                }
            }
            return i;
        }
        function s() {
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
        function i(e, t, r) {
            var i = s(), a = r ? n(e, r) : e, u = {
                id: a
            };
            return null != t.val && (u.value = t.val), t.json && (u.json = t.json), t.isEvent && (u.isEvent = t.isEvent), 
            t.meta && (u.meta = t.meta), t.stream && (i = c(i, o(e, t.stream, r))), t.streams && (i = t.streams.map(function(t) {
                return o(e, t, r);
            }).map(function(e, t) {
                return e.processes[0].id += t + 1, e.arcs.forEach(function(e) {
                    return e.process += t + 1;
                }), e;
            }).reduce(c, i)), i.entities.push(u), i;
        }
        function a(e, t) {
            return Object.keys(e).map(function(r) {
                return i(r, e[r], t);
            }).reduce(c, s());
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.processProcessSpec = o, t.processEntitySpec = i, t.toGraph = a;
        var u = "Stream", f = {
            H: "HOT",
            C: "COLD",
            A: "ACCUMULATOR"
        };
    } ]);
});