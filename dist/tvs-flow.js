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
        var s = n(o), i = r(5), c = n(i), u = r(2), a = n(u);
        t.default = s;
        t.runtime = s, t.types = a, t.utils = {
            entityRef: c
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
                    entities: C,
                    processes: R,
                    arcs: M,
                    meta: w
                };
            }
            function t() {
                var e = {};
                for (var t in L.es) e[t] = L.es[t].val;
                return e;
            }
            function r() {
                return U;
            }
            function n(e) {
                U = e;
            }
            function o() {
                return w;
            }
            function i(e) {
                null == e || "object" !== ("undefined" == typeof e ? "undefined" : s(e)) || e instanceof Array || (w = Object.assign({}, w, e));
            }
            function u(e) {
                Y = e;
            }
            function a(e) {
                return L.es[e] && L.es[e].val;
            }
            function f(e, t) {
                var r = A(e);
                r.val = t, I[e] = !0, H = !0, j();
            }
            function l(e, t) {
                f(e, t(a(e)));
            }
            function d(e, t) {
                var r = A(e);
                r.cb = t;
            }
            function p(e) {
                var t = A(e);
                delete t.cb;
            }
            function v(e) {
                var t = c.createEntity(e);
                C[t.id] = t;
                var r = A(t.id);
                return r.event = t.isEvent, null != t.value && null == r.val && (r.val = t.value, 
                I[t.id] = !1, H = !0), null != t.json && null == r.val && (r.val = JSON.parse(t.json), 
                I[t.id] = !1, H = !0), t;
            }
            function y(e) {
                var t = A(e);
                for (var r in t.arcs) m(r);
                delete L.es[e], delete C[e];
            }
            function O(e) {
                var t = c.createProcess(e, U);
                R[t.id] = t;
                var r = x(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = M[e].port;
                    null == r || t.ports[r] && t.ports[r] !== c.PORT_TYPES.ACCUMULATOR || m(e);
                });
                for (var n in t.ports) t.ports[n] === c.PORT_TYPES.ACCUMULATOR && (r.acc = n);
                for (var o in r.arcs) P(M[o]);
                return t;
            }
            function b(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) m(r);
                delete L.ps[e], delete R[e];
            }
            function T(e) {
                var t = c.createArc(e);
                M[t.id] = t, P(t);
                var r = x(t.process), n = R[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && E(r), 
                t;
            }
            function m(e) {
                var t = M[e];
                if (t) {
                    var r = x(t.process), n = A(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete M[e];
            }
            function P(e) {
                var t = e.process, r = e.entity, n = x(t), o = A(r), s = R[t];
                o.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete o.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = o, s.ports[e.port] == c.PORT_TYPES.HOT && (o.effects[t] = n))) : (n.sink = function(e) {
                    o.val = e, null != e && (I[o.id] = !0, H = !0), D || j();
                }, n.out = o, null != n.acc ? (n.sources[n.acc] = o, o.reactions[t] = n) : delete o.reactions[t]));
            }
            function g(e) {
                if (e.entities) for (var t in e.entities) v(e.entities[t]);
                if (e.processes) for (var r in e.processes) O(e.processes[r]);
                if (e.arcs) for (var n in e.arcs) T(e.arcs[n]);
                e.meta && i(e.meta);
            }
            function j() {
                Y && console.log("flushing graph recursively with", I);
                var e = Object.keys(I);
                if (H) {
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t];
                        if (I[r]) {
                            var n = L.es[r];
                            for (var o in n.reactions) h(n.reactions[o]);
                        }
                    }
                    var s = {};
                    I = {}, H = !1, D = !0;
                    for (var i = 0; i < e.length; i++) {
                        var c = e[i], u = L.es[c];
                        u.cb && (k[c] = u);
                        for (var a in u.effects) s[a] || (h(u.effects[a]), s[a] = !0);
                    }
                    if (D = !1, H) j(); else {
                        for (var f in k) {
                            var l = k[f];
                            l.cb(l.val);
                        }
                        k = {}, Y && console.log("flush finished");
                    }
                }
            }
            function h(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    e.values[r] = n.val;
                }
                if (t) if (Y && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = R[e.id].procedure.apply(U, [ e.sink ].concat(e.values)); else {
                    var o = R[e.id].procedure.apply(U, e.values);
                    e.out && (e.out.val = o, null != o && (I[e.out.id] = null == e.acc, H = !0));
                }
            }
            function E(e) {
                e.async ? setTimeout(function() {
                    h(e);
                }, 10) : (h(e), e.out && (I[e.out.id] = !1, H = !0));
            }
            function _(e) {
                var t = x(e);
                h(t), t.async || j();
            }
            function S(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function A(e) {
                return C[e] || v({
                    id: e
                }), L.es[e] || (L.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function x(e) {
                return L.ps[e] || (L.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var C = {}, R = {}, M = {}, w = {}, U = null, L = {
                es: {},
                ps: {}
            }, Y = !1, k = {}, I = {}, D = !1, H = !1;
            return {
                addEntity: v,
                removeEntity: y,
                addProcess: O,
                removeProcess: b,
                addArc: T,
                removeArc: m,
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
                off: p,
                start: _,
                stop: S,
                flush: j,
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
            var r = e.id, n = void 0 === r ? (0, i.v4)() : r, o = e.ports, s = void 0 === o ? [] : o, u = e.procedure, a = e.code, f = e.autostart, l = void 0 !== f && f, d = e.async, p = void 0 !== d && d, v = e.meta;
            if (null == u && null != a && (u = (0, c.evaluate)(a, t)), null == a && u && (a = u.toString()), 
            null == a || null == u) throw TypeError("Process must have procedure or code set");
            return {
                id: n,
                ports: s,
                procedure: u,
                code: a,
                autostart: l,
                async: p,
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
        }, i = [], c = {}, u = 0; u < 256; u++) i[u] = (u + 256).toString(16).substr(1), 
        c[i[u]] = u;
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
                        var i = t.processId ? n(t.processId, p) : o + r, c = t.dependencies, u = [];
                        if (c) for (var a in c) {
                            var f = c[a];
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
                        }), c) {
                            var l = function(t) {
                                var r = c[t];
                                r.type !== s.PORT_TYPES.ACCUMULATOR && r.entity.onId(function(r) {
                                    e.addArc({
                                        entity: r,
                                        process: i,
                                        port: t
                                    });
                                });
                            };
                            for (var d in c) l(d);
                        }
                    });
                }
                var i = t.value, f = t.json, l = void 0, d = void 0, p = void 0, v = 0, y = [], O = {};
                return O.HOT = {
                    entity: O,
                    type: s.PORT_TYPES.HOT
                }, O.COLD = {
                    entity: O,
                    type: s.PORT_TYPES.COLD
                }, O.getId = function() {
                    return d;
                }, O.onId = function(e) {
                    y.push(e), d && e(d);
                }, O.id = function(t, o) {
                    var s = n(t, o);
                    return d === s ? O : (d && e.removeEntity(d), p = o, d = s, r(), y.forEach(function(e) {
                        return e(s);
                    }), O);
                }, O.val = function(e) {
                    return i = e, r(), O;
                }, O.json = function(e) {
                    return f = e, r(), O;
                }, O.isEvent = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return l = e, r(), O;
                }, t.procedure && o(t, c), O.react = function(e, t, r) {
                    var n = a(e, t, r), i = n.dependencies;
                    return n.dependencies = [ {
                        entity: O,
                        type: s.PORT_TYPES.ACCUMULATOR
                    } ], i && i.length && (n.dependencies = n.dependencies.concat(i)), o(n, u + v++), 
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
            function p(e, r, n) {
                return t(i({}, a(e, r, n), {
                    async: !0,
                    autostart: !0
                }));
            }
            function v(e, t) {
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
                asyncStreamStart: p,
                addToFlow: v
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.create = o;
        var s = r(2), i = Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, c = "Stream", u = "Reaction";
    } ]);
});