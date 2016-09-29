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
                    entities: U,
                    processes: M,
                    arcs: k,
                    meta: w
                };
            }
            function t() {
                var e = {};
                for (var t in _.es) e[t] = _.es[t].val;
                return e;
            }
            function r() {
                return L;
            }
            function n(e) {
                L = e;
            }
            function o() {
                return w;
            }
            function c(e) {
                null == e || "object" != typeof e || e instanceof Array || (w = Object.assign({}, w, e));
            }
            function a(e) {
                Y = e;
            }
            function i(e) {
                return _.es[e] && _.es[e].val;
            }
            function u(e, t) {
                var r = S(e);
                r.val = t, h(r), b();
            }
            function f(e, t) {
                u(e, t(i(e)));
            }
            function l(e, t) {
                var r = S(e);
                r.cb = t;
            }
            function v(e) {
                var t = S(e);
                delete t.cb;
            }
            function p(e) {
                var t = s.createEntity(e);
                U[t.id] = t;
                var r = S(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                h(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), h(r)), t;
            }
            function d(e) {
                var t = S(e);
                for (var r in t.arcs) T(r);
                delete _.es[e], delete U[e];
            }
            function y(e) {
                var t = s.createProcess(e, L);
                M[t.id] = t;
                var r = R(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var c = k[o].port;
                    c && (n.indexOf(c) < 0 || t.ports[c] === s.PORT_TYPES.ACCUMULATOR) && T(o);
                }
                for (var a in t.ports) t.ports[a] === s.PORT_TYPES.ACCUMULATOR && (r.acc = a);
                for (var o in r.arcs) P(k[o]);
                return t;
            }
            function m(e) {
                var t = R(e);
                t.stop && t.stop();
                for (var r in t.arcs) T(r);
                delete _.ps[e], delete M[e];
            }
            function O(e) {
                var t = s.createArc(e);
                k[t.id] = t, P(t);
                var r = R(t.process), n = M[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && E(r), 
                t;
            }
            function T(e) {
                var t = k[e];
                if (t) {
                    var r = R(t.process), n = S(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete k[e];
            }
            function P(e) {
                var t = e.process, r = e.entity, n = R(t), o = S(r), c = M[t];
                o.arcs[e.id] = !0, c && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, c.ports[e.port] == s.PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, h(o), q || b();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function g(e) {
                if (e.entities) for (var t in e.entities) p(e.entities[t]);
                if (e.processes) for (var t in e.processes) y(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) O(e.arcs[t]);
                e.meta && c(e.meta), b();
            }
            function h(e, t) {
                H[e.id] = t || !0;
            }
            function x(e, t, r) {
                if (void 0 === t && (t = 0), N[e.id] = !0, e.cb && (G[e.id] = e), !r || !r.acc) {
                    var n = !1;
                    for (var s in e.reactions) n = !0, F[s] ? F[s].level < t && (F[s].level = t) : F[s] = {
                        level: t,
                        eP: e.reactions[s]
                    };
                    n && t++;
                }
                for (var s in e.effects) {
                    var o = e.effects[s];
                    if (o.async) J[s] = o; else {
                        if (o.acc && o.out && null == o.out.val) continue;
                        F[s] ? F[s].level < t && (F[s].level = t) : F[s] = {
                            level: t,
                            eP: o
                        }, o.out && x(o.out, t + 1, o);
                    }
                }
            }
            function b() {
                Y && console.log("flushing graph with", H), N = {}, F = {}, J = {}, G = {};
                for (var e in H) x(_.es[e], 0, H[e]);
                H = {};
                for (var e in F) {
                    var t = F[e];
                    D[t.level] ? D[t.level].push(t.eP) : D[t.level] = [ t.eP ];
                }
                for (var r = 0; r < D.length; r++) for (var n = 0; n < D[r].length; n++) j(D[r][n], N);
                D.length = 0;
                for (var e in G) G[e].cb(G[e].val);
                var s = !1;
                q = !0;
                for (var o in J) s = !0, j(J[o], N);
                q = !1, s && b();
            }
            function j(e, t) {
                Y && console.log("executing process", e.id);
                for (var r in e.sources) {
                    var n = e.sources[r];
                    !n.event || t && t[n.id] ? e.values[r] = n.val : e.values[r] = void 0;
                }
                if (e.async) e.stop && e.stop(), e.stop = M[e.id].procedure.call(L, e.values, e.sink); else {
                    var s = M[e.id].procedure.call(L, e.values);
                    e.out && (e.out.val = s);
                }
            }
            function E(e) {
                e.async ? setTimeout(function() {
                    j(e);
                }, 10) : (j(e), h(e.out));
            }
            function A(e) {
                var t = R(e);
                j(t), t.out && !t.async && (h(t.out, t), b());
            }
            function C(e) {
                var t = R(e);
                t.stop && t.stop(), delete t.stop;
            }
            function S(e) {
                return U[e] || p({
                    id: e
                }), _.es[e] || (_.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function R(e) {
                return _.ps[e] || (_.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var U = {}, M = {}, k = {}, w = {}, L = null, _ = {
                es: {},
                ps: {}
            }, Y = !1, H = {}, D = [], G = {}, F = {}, J = {}, N = {}, q = !1;
            return {
                addEntity: p,
                removeEntity: d,
                addProcess: y,
                removeProcess: m,
                addArc: O,
                removeArc: T,
                addGraph: g,
                getGraph: e,
                getState: t,
                setMeta: c,
                getMeta: o,
                getContext: r,
                setContext: n,
                setDebug: a,
                get: i,
                set: u,
                update: f,
                on: l,
                off: v,
                start: A,
                stop: C,
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
            var r = e.id, n = void 0 === r ? c.v4() : r, s = e.ports, o = void 0 === s ? {} : s, i = e.procedure, u = e.code, f = e.autostart, l = e.async, v = e.meta;
            if (null == i && null != u && (i = a.evaluate(u, t)), null == u && i && (u = i.toString()), 
            null == u || null == i) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: o,
                procedure: i,
                code: u,
                autostart: f,
                async: l,
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
            var t = e.split(" "), r = t[0], n = t[1], s = f[r.toUpperCase()];
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
                    var f = r(t.deps[i]);
                    if (c.ports[i] = f.type, f.eid) {
                        if (0 === f.eid.indexOf("#")) {
                            var l = f.eid.substr(1);
                            f.eid = s ? n(l, s) : l;
                        }
                        a.arcs.push({
                            entity: f.eid,
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
        var u = "Stream", f = {
            H: "HOT",
            C: "COLD",
            A: "ACCUMULATOR"
        };
        t.processProcessSpec = s, t.processEntitySpec = a, t.toGraph = i;
    } ]);
});