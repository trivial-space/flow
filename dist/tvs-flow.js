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
                    entities: w,
                    processes: k,
                    arcs: U,
                    meta: Y
                };
            }
            function t() {
                var e = {};
                for (var t in D.es) e[t] = D.es[t].val;
                return e;
            }
            function r() {
                return L;
            }
            function n(e) {
                L = e;
            }
            function a() {
                return Y;
            }
            function c(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : o(e)) || e instanceof Array || (Y = s({}, Y, e));
            }
            function i(e) {
                F = e;
            }
            function l(e) {
                return D.es[e] && D.es[e].val;
            }
            function f(e, t) {
                var r = C(e);
                r.val = t, j(r), _();
            }
            function v(e, t) {
                f(e, t(l(e)));
            }
            function d(e, t) {
                var r = C(e);
                r.cb = t;
            }
            function p(e) {
                var t = C(e);
                delete t.cb;
            }
            function y(e) {
                var t = u["default"].createEntity(e);
                w[t.id] = t;
                var r = C(t.id);
                return null != t.value && null == r.val && (r.val = t.value, j(r)), null != t.json && null == r.val && (r.val = JSON.parse(t.json), 
                j(r)), t;
            }
            function m(e) {
                var t = C(e);
                for (var r in t.arcs) b(r);
                delete D.es[e], delete w[e];
            }
            function g(e) {
                var t = u["default"].createProcess(e, L);
                k[t.id] = t;
                var r = R(t.id);
                r.acc = null, r.async = t.async;
                var n = Object.keys(t.ports);
                for (var o in r.arcs) {
                    var a = U[o].port;
                    a && (n.indexOf(a) < 0 || t.ports[a] === u["default"].PORT_TYPES.ACCUMULATOR) && b(o);
                }
                for (var s in t.ports) t.ports[s] === u["default"].PORT_TYPES.ACCUMULATOR && (r.acc = s);
                for (var c in r.arcs) x(U[c]);
                return t;
            }
            function O(e) {
                var t = R(e);
                t.stop && t.stop();
                for (var r in t.arcs) b(r);
                delete D.ps[e], delete k[e];
            }
            function P(e) {
                var t = u["default"].createArc(e);
                U[t.id] = t, x(t);
                var r = R(t.process), n = k[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && A(r), 
                t;
            }
            function b(e) {
                var t = U[e];
                if (t) {
                    var r = R(t.process), n = C(t.entity);
                    delete r.arcs[e], delete n.arcs[e], t.port ? (delete n.effects[t.process], delete r.sources[t.port], 
                    delete r.values[t.port]) : (r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete U[e];
            }
            function x(e) {
                var t = e.process, r = e.entity, n = R(t), o = C(r), a = k[t];
                o.arcs[e.id] = !0, a && (n.arcs[e.id] = !0, e.port ? (n.sources[e.port] = o, a.ports[e.port] == u["default"].PORT_TYPES.HOT ? o.effects[t] = n : delete o.effects[t]) : (n.sink = function(e) {
                    o.val = e, j(o), _();
                }, n.out = o, n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function h(e) {
                if (e.entities) for (var t in e.entities) y(e.entities[t]);
                if (e.processes) for (var r in e.processes) g(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) P(e.arcs[n]);
                e.meta && c(e.meta), _();
            }
            function j(e, t) {
                G[e.id] = t || !0;
            }
            function T(e, t, r, n) {
                var o = arguments.length <= 4 || void 0 === arguments[4] ? 0 : arguments[4], a = arguments[5];
                if (n.cb && (r[n.id] = n), !a || !a.acc) {
                    var s = !1;
                    for (var c in n.reactions) s = !0, e[c] ? e[c].level < o && (e[c].level = o) : e[c] = {
                        level: o,
                        eP: n.reactions[c]
                    };
                    s && o++;
                }
                for (var u in n.effects) {
                    var i = n.effects[u];
                    i.async ? t[u] = i : (e[u] ? e[u].level < o && (e[u].level = o) : e[u] = {
                        level: o,
                        eP: i
                    }, i.out && T(e, t, r, i.out, o + 1, i));
                }
            }
            function _() {
                F && console.log("flushing graph with", G);
                var e = [], t = {}, r = {}, n = {};
                for (var o in G) T(r, n, t, D.es[o], 0, G[o]);
                G = {};
                for (var a in r) {
                    var s = r[a];
                    e[s.level] ? e[s.level].push(s.eP) : e[s.level] = [ s.eP ];
                }
                for (var c = 0; c < e.length; c++) for (var u = 0; u < e[c].length; u++) {
                    var i = e[c][u];
                    M(i);
                }
                for (var l in t) t[l].cb(t[l].val);
                for (var f in n) M(n[f]);
            }
            function M(e) {
                F && console.log("executing process", e.id);
                for (var t in e.sources) e.values[t] = e.sources[t].val;
                if (e.async) e.stop && e.stop(), e.stop = k[e.id].procedure.call(L, e.values, e.sink); else {
                    var r = k[e.id].procedure.call(L, e.values);
                    e.out && (e.out.val = r);
                }
            }
            function A(e) {
                e.async ? setTimeout(function() {
                    M(e);
                }, 10) : (M(e), j(e.out));
            }
            function E(e) {
                var t = R(e);
                M(t), t.out && !t.async && (j(t.out, t), _());
            }
            function S(e) {
                var t = R(e);
                t.stop && t.stop(), delete t.stop;
            }
            function C(e) {
                return w[e] || y({
                    id: e
                }), D.es[e] || (D.es[e] = {
                    id: e,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function R(e) {
                return D.ps[e] || (D.ps[e] = {
                    id: e,
                    acc: null,
                    sources: {},
                    arcs: {},
                    values: {},
                    sink: function() {}
                });
            }
            var w = {}, k = {}, U = {}, Y = {}, L = null, D = {
                es: {},
                ps: {}
            }, F = !1, G = {};
            return {
                addEntity: y,
                removeEntity: m,
                addProcess: g,
                removeProcess: O,
                addArc: P,
                removeArc: b,
                addGraph: h,
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
                start: E,
                stop: S,
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
            var t = e.id, r = void 0 === t ? (0, c.v4)() : t, n = e.value, o = e.json, a = e.meta;
            return {
                id: r,
                value: n,
                json: o,
                meta: s({}, a)
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