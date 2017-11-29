!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.tvsFlow=t():e.tvsFlow=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createEntity=function(e){var t=e.id,r=void 0===t?Object(n.a)():t,o=e.value,c=e.json,i=e.accept,a=e.reset,s=e.meta;return void 0===o&&c&&(o=JSON.parse(c)),{id:r,value:o,accept:i,reset:a,meta:s}},t.createProcess=function(e,t){var r=e.id,i=void 0===r?Object(n.a)():r,a=e.ports,s=void 0===a?[]:a,u=e.procedure,f=e.code,p=e.autostart,d=void 0!==p&&p,l=e.async,v=void 0!==l&&l,y=e.delta,O=void 0!==y&&y,h=e.meta;if(null==u&&null!=f&&(u=Object(o.a)(f,t)),null==u)throw TypeError("Process must have procedure or code set");return O&&!s.length&&s.push(c.HOT),{id:i,ports:s,procedure:u,autostart:d,async:v,delta:O,meta:h}},t.createArc=function(e){var t=e.id,r=e.entity,n=e.process,o=e.port,c=e.meta;if(null==r)throw TypeError("no entity specified in arc "+t);if(null==n)throw TypeError("no process specified in arc "+t);return null==t&&(t=null==o?n+"->"+r:r+"->"+n+"::"+o),{id:t,entity:r,process:n,port:o,meta:c}},r.d(t,"PORT_TYPES",function(){return c});var n=r(1),o=r(5),c={COLD:"COLD",HOT:"HOT",ACCUMULATOR:"ACCUMULATOR"}},function(e,t,r){"use strict";t.a=function(){var e=o();return e[6]=15&e[6]|64,e[8]=63&e[8]|128,function(e){var t=c,r=0;return t[e[r++]]+t[e[r++]]+t[e[r++]]+t[e[r++]]+"-"+t[e[r++]]+t[e[r++]]+"-"+t[e[r++]]+t[e[r++]]+"-"+t[e[r++]]+t[e[r++]]+"-"+t[e[r++]]+t[e[r++]]+t[e[r++]]+t[e[r++]]+t[e[r++]]+t[e[r++]]}(e)};for(var n=new Array(16),o=function(){for(var e=0,t=void 0;e<16;e++)0==(3&e)&&(t=4294967296*Math.random(),n[e]=t>>>((3&e)<<3)&255);return n},c=[],i={},a=0;a<256;a++)c[a]=(a+256).toString(16).substr(1),i[c[a]]=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.empty=function(){return{entities:{},processes:{},arcs:{},meta:{}}},t.merge=function(e,t){return{entities:n({},e.entities,t.entities),processes:n({},e.processes,t.processes),arcs:n({},e.arcs,t.arcs),meta:n({},e.meta,t.meta)}};var n=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r.d(t,"runtime",function(){return a}),r.d(t,"create",function(){return s}),r.d(t,"types",function(){return u}),r.d(t,"utils",function(){return f});var n=r(4),o=r(7),c=r(2),i=r(0);t.default=n;var a=n,s=n.create,u=i,f={entityRef:o,graph:c}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.create=function(){function e(e){return null==e||"object"!=typeof e||Array.isArray(e)||(P=Object(o.a)(P,e)),P}function t(e){return j.es[e]&&j.es[e].val}function r(e,t){O(h(e),t,!0)&&v()}function i(t){var r=Object(n.createEntity)(t);g[r.id]=r;var o=h(r.id);return void 0===r.value||!r.reset&&void 0!==o.val||(o.val=r.value,x[r.id]=!1,C=!0),o.accept=r.accept,r.meta&&e({entities:(c={},c[r.id]=r.meta,c)}),r;var c}function a(t){var r=h(t);for(var n in r.arcs)p(n);var o=g[t];o&&o.meta&&e({entities:(c={},c[o.id]=void 0,c)}),delete j.es[t],delete g[t];var c}function s(t){var r=Object(n.createProcess)(t,T),o=r.ports,c=b(r.id);m[r.id]=r,delete c.acc,c.values=[],c.sources=[],c.async=r.async,c.delta=r.delta,Object.keys(c.arcs).forEach(function(e){var t=_[e].port;null==t||o[t]&&o[t]!==n.PORT_TYPES.ACCUMULATOR||p(e)}),o.forEach(function(e,t){e===n.PORT_TYPES.ACCUMULATOR&&(c.acc=t)});for(var i in c.arcs)d(_[i]);return r.meta&&e({processes:(a={},a[r.id]=r.meta,a)}),r;var a}function u(t){var r=b(t);r.stop&&(r.stop(),delete r.stop);for(var n in r.arcs)p(n);delete j.ps[t];var o=m[t];o&&o.meta&&e({processes:(c={},c[o.id]=void 0,c)}),delete m[t];var c}function f(t){var r=Object(n.createArc)(t);_[r.id]=r,d(r);var o=b(r.process),c=m[r.process];return c&&!0===c.autostart&&Object.keys(o.arcs).length===Object.keys(c.ports).length+1&&function(e){e.async?requestAnimationFrame(function(){y(e)}):(y(e),e.out&&(x[e.out.id]=!1))}(o),r.meta&&e({arcs:(i={},i[r.id]=r.meta,i)}),r;var i}function p(t){var r=_[t];if(r){var n=b(r.process),o=h(r.entity);delete n.arcs[t],delete o.arcs[t],null!=r.port?(delete o.effects[r.process],delete n.sources[r.port],delete n.values[r.port]):(n.stop&&(n.stop(),delete n.stop),n.sink=function(){},delete n.out,delete o.reactions[r.process]),r.meta&&e({arcs:(c={},c[r.id]=void 0,c)})}delete _[t];var c}function d(e){var t=e.process,r=e.entity,o=b(t),c=h(r),i=m[t];c.arcs[e.id]=!0,i&&(o.arcs[e.id]=!0,null!=e.port?(delete c.effects[t],i.ports&&null!=i.ports[e.port]&&(o.sources[e.port]=c,i.ports[e.port]===n.PORT_TYPES.HOT&&(c.effects[t]=o))):(o.out=c,null!=o.acc?(o.sources[o.acc]=c,c.reactions[t]=o):delete c.reactions[t],o.sink=function(e){O(c,e,!0)&&!S&&v()}))}function l(t){if(t.entities)for(var r in t.entities)i(t.entities[r]);if(t.processes)for(var r in t.processes)s(t.processes[r]);if(t.arcs)for(var r in t.arcs)f(t.arcs[r]);e(t.meta)}function v(){A&&console.log("flushing graph recursively with",x);for(var e=Object.keys(x),t=0,r=e;t<r.length;t++)if(a=r[t],x[a]){f=j.es[a];for(var n in f.reactions)y(f.reactions[n])}var o={};x={},C=!1,S=!0;for(var c=0,i=e;c<i.length;c++){var a=i[c];(f=j.es[a]).cb.length>0&&(E[a]=f);for(var n in f.effects)o[n]||(y(f.effects[n]),o[n]=!0)}if(S=!1,C)v();else{var s=Object.keys(E);E={};for(var u in s)for(var f,p=0,d=(f=j.es[s[u]]).cb;p<d.length;p++)(0,d[p])(f.val);A&&console.log("flush finished")}}function y(e){for(var t=!0,r=0;r<e.sources.length;r++){var n=e.sources[r];if(void 0===n.val){t=!1;break}if(e.values[r]=n.val,e.delta){if(void 0===n.oldVal){t=!1;break}e.values[r+1]=n.oldVal}}if(t)if(A&&console.log("running process",e.id),e.async)e.stop&&e.stop(),e.stop=m[e.id].procedure.apply(T,[e.sink].concat(e.values));else{var o=m[e.id].procedure.apply(T,e.values);e.out&&O(e.out,o,null==e.acc)}}function O(e,t,r){return!(void 0===t||e.accept&&!e.accept(t,e.val)||(e.oldVal=e.val,e.val=t,x[e.id]=r,C=!0,0))}function h(e){return g[e]||i({id:e}),j.es[e]||(j.es[e]={id:e,val:void 0,reactions:{},effects:{},arcs:{},cb:[]})}function b(e){return j.ps[e]||(j.ps[e]={id:e,arcs:{},sink:function(){}})}var g={},m={},_={},j={es:{},ps:{}},P={},T=null,A=!1,E={},x={},S=!1,C=!1;return{addEntity:i,removeEntity:a,addProcess:s,removeProcess:u,addArc:f,removeArc:p,addGraph:l,replaceGraph:function(e){var t={},r={};if(e.entities)for(var n in e.entities){var o=e.entities[n];o.id&&(t[o.id]=!0)}if(e.processes)for(var n in e.processes){var c=e.processes[n];c.id&&(r[c.id]=!0)}Object.keys(g).filter(function(e){return!t[e]}).forEach(a),Object.keys(m).filter(function(e){return!r[e]}).forEach(u),l(e)},getGraph:function(){return{entities:g,processes:m,arcs:_,meta:P}},getState:function(){var e={};for(var t in j.es)e[t]=j.es[t].val;return e},setMeta:e,getMeta:function(){return P},getContext:function(){return T},setContext:function(e){T=e},setDebug:function(e){A=e},get:t,set:r,update:function(e,n){r(e,n(t(e)))},on:function(e,t){h(e).cb.push(t)},off:function(e,t){var r=h(e);r.cb=t?r.cb.filter(function(e){return e!==t}):[]},start:function(e){var t=b(e);y(t),t.async||v()},stop:function(e){var t=b(e);t.stop&&(t.stop(),delete t.stop)},flush:v,PORT_TYPES:c({},n.PORT_TYPES)}};var n=r(0),o=r(6),c=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}},function(module,__webpack_exports__,__webpack_require__){"use strict";function evaluate(code,context){var prefix="(function(){ return ",postfix="})",factory=eval(prefix+code+postfix);return factory.call(context)}__webpack_exports__.a=evaluate},function(e,t,r){"use strict";function n(e,t){if("object"==typeof e&&"object"==typeof t&&!Array.isArray(e)&&!Array.isArray(t)){var r=o({},e);for(var c in t){var i=e[c],a=t[c];void 0!==a?r[c]=n(i,a):delete r[c]}return r}return t}t.a=n;var o=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}},function(e,t,r){"use strict";function n(e,t){return t?t+"."+e:e}function o(e){var t,r,o,i=e.value,f=Object(u.a)(),p=[],l={};return l.HOT={entity:l,type:s.PORT_TYPES.HOT},l.COLD={entity:l,type:s.PORT_TYPES.COLD},l.id=function(e,r){return f=n(e,r),t=r,l},l.val=function(e){return i=e,l},l.updateVal=function(e){return i=e(i),l},l.accept=function(e){return r=e,l},l.reset=function(){return o=!0,l},l.getId=function(){return f},e.procedure&&p.push(e),l.react=function(e,t,r){var n=c(e,t,r);n.pidSuffix=d;var o=n.dependencies;return n.dependencies=[{entity:l,type:s.PORT_TYPES.ACCUMULATOR}],o&&o.length&&(n.dependencies=n.dependencies.concat(o)),p.push(n),l},l.getGraph=function(){var e=a.empty();return e.entities[f]=Object(s.createEntity)({id:f,value:i,accept:r,reset:o}),p.forEach(function(r){var o=r.dependencies,c=r.processId?n(r.processId,t):f+r.pidSuffix+(o&&o.length?":"+o.reduce(function(e,t){var r=t.entity.getId();return r===f?e:e+":"+r},""):""),i=[];o&&o.forEach(function(t,r){if(i[r]=t.type,t.type!==s.PORT_TYPES.ACCUMULATOR){var n=Object(s.createArc)({process:c,entity:t.entity.getId(),port:r});e.arcs[n.id]=n}});var a=Object(s.createArc)({process:c,entity:f});e.arcs[a.id]=a,e.processes[c]=Object(s.createProcess)({id:c,ports:i,procedure:r.procedure,async:r.async,autostart:r.autostart,delta:r.delta})}),e},l}function c(e,t,r){var n={procedure:t};return null!=e&&e.length&&(n.dependencies=e),"string"==typeof r?n.processId=r:n.pidSuffix=p,n}function i(e){return e&&"function"==typeof e.id&&"function"==typeof e.getGraph&&e.HOT&&e.COLD}Object.defineProperty(t,"__esModule",{value:!0}),t.val=function(e){return o({value:e})},r.d(t,"stream",function(){return l}),r.d(t,"asyncStream",function(){return v}),r.d(t,"streamStart",function(){return y}),r.d(t,"asyncStreamStart",function(){return O}),r.d(t,"delta",function(){return h}),t.isEntity=i,t.resolveEntityIds=function(e,t){for(var r in e){var n=e[r];i(n)&&n.id(r,t)}return e},t.getGraphFromAll=function(e){var t=[];for(var r in e){var n=e[r];i(n)&&t.push(n)}return t.reduce(function(e,t){return a.merge(e,t.getGraph())},a.empty())};var a=r(2),s=r(0),u=r(1),f=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},p="Stream",d="Reaction",l=function(e,t,r){return o(c(e,t,r))},v=function(e,t,r){return o(f({},c(e,t,r),{async:!0}))},y=function(e,t,r){return o(f({},c(e,t,r),{autostart:!0}))},O=function(e,t,r){return o(f({},c(e,t,r),{async:!0,autostart:!0}))},h=function(e,t,r){return o(f({},c([e.HOT],t,r),{delta:!0}))}}])});