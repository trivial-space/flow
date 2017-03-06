!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.tvsFlow = t() : e.tvsFlow = t();
}(this, function() {
    return function(e) {
        function t(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
        }
        var r = {};
        return t.m = e, t.c = r, t.i = function(e) {
            return e;
        }, t.d = function(e, r, n) {
            t.o(e, r) || Object.defineProperty(e, r, {
                configurable: !1,
                enumerable: !0,
                get: n
            });
        }, t.n = function(e) {
            var r = e && e.__esModule ? function() {
                return e.default;
            } : function() {
                return e;
            };
            return t.d(r, "a", r), r;
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }, t.p = "", t(t.s = 5);
    }([ function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.id;
            return {
                id: void 0 === t ? r.i(s.a)() : t,
                value: e.value,
                json: e.json,
                meta: a({}, e.meta)
            };
        }
        function o(e, t) {
            var n = e.id, o = void 0 === n ? r.i(s.a)() : n, c = e.ports, u = void 0 === c ? [] : c, f = e.procedure, l = e.code, p = e.autostart, d = void 0 !== p && p, v = e.async, y = void 0 !== v && v, O = e.meta;
            if (null == f && null != l && (f = r.i(i.a)(l, t)), null == l && f && (l = f.toString()), 
            null == l || null == f) throw TypeError("Process must have procedure or code set");
            return {
                id: o,
                ports: u,
                procedure: f,
                code: l,
                autostart: d,
                async: y,
                meta: a({}, O)
            };
        }
        function c(e) {
            var t = e.id, r = e.entity, n = e.process, o = e.port, c = e.meta;
            if (null == r) throw TypeError("no entity specified in arc " + t);
            if (null == n) throw TypeError("no process specified in arc " + t);
            return null == t && (t = null == o ? n + "->" + r : r + "->" + n + "::" + o), {
                id: t,
                entity: r,
                process: n,
                port: o,
                meta: a({}, c)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = r(4), i = r(3);
        t.createEntity = n, t.createProcess = o, t.createArc = c, r.d(t, "PORT_TYPES", function() {
            return u;
        });
        var a = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, u = {
            COLD: "COLD",
            HOT: "HOT",
            ACCUMULATOR: "ACCUMULATOR"
        };
    }, function(e, t, r) {
        "use strict";
        function n() {
            function e() {
                return {
                    entities: C,
                    processes: S,
                    arcs: R,
                    meta: w
                };
            }
            function t() {
                var e = {};
                for (var t in k.es) e[t] = k.es[t].val;
                return e;
            }
            function r() {
                return M;
            }
            function n(e) {
                M = e;
            }
            function c() {
                return w;
            }
            function s(e) {
                null == e || "object" != typeof e || e instanceof Array || (w = Object.assign({}, w, e));
            }
            function i(e) {
                U = e;
            }
            function a(e) {
                return k.es[e] && k.es[e].val;
            }
            function u(e, t) {
                E(e).val = t, Y[e] = !0, D = !0, h();
            }
            function f(e, t) {
                u(e, t(a(e)));
            }
            function l(e, t) {
                E(e).cb = t;
            }
            function p(e) {
                delete E(e).cb;
            }
            function d(e) {
                var t = o.createEntity(e);
                C[t.id] = t;
                var r = E(t.id);
                return null != t.value && null == r.val && (r.val = t.value, Y[t.id] = !1, D = !0), 
                null != t.json && null == r.val && (r.val = JSON.parse(t.json), Y[t.id] = !1, D = !0), 
                t;
            }
            function v(e) {
                var t = E(e);
                for (var r in t.arcs) T(r);
                delete k.es[e], delete C[e];
            }
            function y(e) {
                var t = o.createProcess(e, M);
                S[t.id] = t;
                var r = x(t.id);
                delete r.acc, r.values = [], r.sources = [], r.async = t.async, Object.keys(r.arcs).forEach(function(e) {
                    var r = R[e].port;
                    null == r || t.ports[r] && t.ports[r] !== o.PORT_TYPES.ACCUMULATOR || T(e);
                });
                for (var n in t.ports) t.ports[n] === o.PORT_TYPES.ACCUMULATOR && (r.acc = n);
                for (var c in r.arcs) g(R[c]);
                return t;
            }
            function O(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
                for (var r in t.arcs) T(r);
                delete k.ps[e], delete S[e];
            }
            function _(e) {
                var t = o.createArc(e);
                R[t.id] = t, g(t);
                var r = x(t.process), n = S[t.process];
                return n && n.autostart === !0 && Object.keys(r.arcs).length === Object.keys(n.ports).length + 1 && m(r), 
                t;
            }
            function T(e) {
                var t = R[e];
                if (t) {
                    var r = x(t.process), n = E(t.entity);
                    delete r.arcs[e], delete n.arcs[e], null != t.port ? (delete n.effects[t.process], 
                    delete r.sources[t.port], delete r.values[t.port]) : (r.stop && (r.stop(), delete r.stop), 
                    r.sink = function() {}, delete r.out, delete n.reactions[t.process]);
                }
                delete R[e];
            }
            function g(e) {
                var t = e.process, r = e.entity, n = x(t), c = E(r), s = S[t];
                c.arcs[e.id] = !0, s && (n.arcs[e.id] = !0, null != e.port ? (delete c.effects[t], 
                s.ports && null != s.ports[e.port] && (n.sources[e.port] = c, s.ports[e.port] == o.PORT_TYPES.HOT && (c.effects[t] = n))) : (n.sink = function(e) {
                    c.val = e, null != e && (Y[c.id] = !0, D = !0), I || h();
                }, n.out = c, null != n.acc ? (n.sources[n.acc] = c, c.reactions[t] = n) : delete c.reactions[t]));
            }
            function P(e) {
                if (e.entities) for (var t in e.entities) d(e.entities[t]);
                if (e.processes) for (var t in e.processes) y(e.processes[t]);
                if (e.arcs) for (var t in e.arcs) _(e.arcs[t]);
                e.meta && s(e.meta);
            }
            function h() {
                U && console.log("flushing graph recursively with", Y);
                var e = Object.keys(Y);
                if (D) {
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t];
                        if (Y[r]) {
                            var n = k.es[r];
                            for (var o in n.reactions) b(n.reactions[o]);
                        }
                    }
                    var c = {};
                    Y = {}, D = !1, I = !0;
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t], n = k.es[r];
                        n.cb && (L[r] = n);
                        for (var o in n.effects) c[o] || (b(n.effects[o]), c[o] = !0);
                    }
                    if (I = !1, D) h(); else {
                        for (var r in L) {
                            var n = L[r];
                            n.cb(n.val);
                        }
                        L = {}, U && console.log("flush finished");
                    }
                }
            }
            function b(e) {
                for (var t = !0, r = 0; r < e.sources.length; r++) {
                    var n = e.sources[r];
                    if (null == n.val) {
                        t = !1;
                        break;
                    }
                    e.values[r] = n.val;
                }
                if (t) if (U && console.log("running process", e.id), e.async) e.stop && e.stop(), 
                e.stop = S[e.id].procedure.apply(M, [ e.sink ].concat(e.values)); else {
                    var o = S[e.id].procedure.apply(M, e.values);
                    e.out && (e.out.val = o, null != o && (Y[e.out.id] = null == e.acc, D = !0));
                }
            }
            function m(e) {
                e.async ? setTimeout(function() {
                    b(e);
                }, 10) : (b(e), e.out && (Y[e.out.id] = !1, D = !0));
            }
            function j(e) {
                var t = x(e);
                b(t), t.async || h();
            }
            function A(e) {
                var t = x(e);
                t.stop && (t.stop(), delete t.stop);
            }
            function E(e) {
                return C[e] || d({
                    id: e
                }), k.es[e] || (k.es[e] = {
                    id: e,
                    val: void 0,
                    reactions: {},
                    effects: {},
                    arcs: {}
                });
            }
            function x(e) {
                return k.ps[e] || (k.ps[e] = {
                    id: e,
                    arcs: {},
                    sink: function() {}
                });
            }
            var C = {}, S = {}, R = {}, w = {}, M = null, k = {
                es: {},
                ps: {}
            }, U = !1, L = {}, Y = {}, I = !1, D = !1;
            return {
                addEntity: d,
                removeEntity: v,
                addProcess: y,
                removeProcess: O,
                addArc: _,
                removeArc: T,
                addGraph: P,
                getGraph: e,
                getState: t,
                setMeta: s,
                getMeta: c,
                getContext: r,
                setContext: n,
                setDebug: i,
                get: a,
                set: u,
                update: f,
                on: l,
                off: p,
                start: j,
                stop: A,
                flush: h,
                PORT_TYPES: Object.assign({}, o.PORT_TYPES)
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = r(0);
        t.create = n;
    }, function(e, t, r) {
        "use strict";
        function n(e, t) {
            return t ? t + "." + e : e;
        }
        function o(e) {
            function t(t) {
                function r() {
                    s && e.addEntity({
                        id: s,
                        value: l,
                        json: p
                    });
                }
                function o(t, r) {
                    y.onId(function(o) {
                        var s = t.processId ? n(t.processId, f) : o + r, i = t.dependencies, a = [];
                        if (i) for (var u in i) {
                            var l = i[u];
                            a[u] = l.type;
                        }
                        if (e.addProcess({
                            id: s,
                            procedure: t.procedure,
                            ports: a,
                            async: t.async,
                            autostart: t.autostart
                        }), e.addArc({
                            process: s,
                            entity: o
                        }), i) {
                            var p = function(t) {
                                var r = i[t];
                                r.type !== c.PORT_TYPES.ACCUMULATOR && r.entity.onId(function(r) {
                                    e.addArc({
                                        entity: r,
                                        process: s,
                                        port: t
                                    });
                                });
                            };
                            for (var u in i) p(u);
                        }
                    });
                }
                var s, f, l = t.value, p = t.json, d = 0, v = [], y = {};
                return y.HOT = {
                    entity: y,
                    type: c.PORT_TYPES.HOT
                }, y.COLD = {
                    entity: y,
                    type: c.PORT_TYPES.COLD
                }, y.getId = function() {
                    return s;
                }, y.onId = function(e) {
                    v.push(e), s && e(s);
                }, y.id = function(t, o) {
                    var c = n(t, o);
                    return s === c ? y : (s && e.removeEntity(s), f = o, s = c, r(), v.forEach(function(e) {
                        return e(c);
                    }), y);
                }, y.val = function(e) {
                    return l = e, r(), y;
                }, y.json = function(e) {
                    return p = e, r(), y;
                }, t.procedure && o(t, i), y.react = function(e, t, r) {
                    var n = u(e, t, r), s = n.dependencies;
                    return n.dependencies = [ {
                        entity: y,
                        type: c.PORT_TYPES.ACCUMULATOR
                    } ], s && s.length && (n.dependencies = n.dependencies.concat(s)), o(n, a + d++), 
                    y;
                }, y;
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
            function u(e, t, r) {
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
                return t(u(e, r, n));
            }
            function l(e, r, n) {
                return t(s({}, u(e, r, n), {
                    async: !0
                }));
            }
            function p(e, r, n) {
                return t(s({}, u(e, r, n), {
                    autostart: !0
                }));
            }
            function d(e, r, n) {
                return t(s({}, u(e, r, n), {
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
                streamStart: p,
                asyncStream: l,
                asyncStreamStart: d,
                addToFlow: v
            };
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var c = r(0);
        t.create = o;
        var s = this && this.__assign || Object.assign || function(e) {
            for (var t, r = 1, n = arguments.length; r < n; r++) {
                t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
        }, i = "Stream", a = "Reaction";
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function evaluate(code, context) {
            var prefix = "(function(){ return ", postfix = "})", factory = eval(prefix + code + postfix);
            return factory.call(context);
        }
        __webpack_exports__.a = evaluate;
    }, function(e, t, r) {
        "use strict";
        function n(e) {
            var t = 0, r = i;
            return r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + "-" + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]] + r[e[t++]];
        }
        function o() {
            var e = s();
            return e[6] = 15 & e[6] | 64, e[8] = 63 & e[8] | 128, n(e);
        }
        t.a = o;
        for (var c = new Array(16), s = function() {
            for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), 
            c[t] = e >>> ((3 & t) << 3) & 255;
            return c;
        }, i = [], a = {}, u = 0; u < 256; u++) i[u] = (u + 256).toString(16).substr(1), 
        a[i[u]] = u;
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(1), o = r(2), c = r(0);
        r.d(t, "create", function() {
            return n.create;
        }), r.d(t, "runtime", function() {
            return s;
        }), r.d(t, "types", function() {
            return i;
        }), r.d(t, "utils", function() {
            return a;
        }), t.default = n;
        var s = n, i = c, a = {
            entityRef: o
        };
    } ]);
});