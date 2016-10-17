import * as runtime from '../src/index';
var spec = {
    e1: {
        val: 0,
        stream: {
            with: {
                self: 'a',
                tick: 'h tick'
            },
            do: function (p) { return p.self + 1; }
        }
    },
    e2: {
        val: 0,
        stream: {
            async: true,
            with: { e1: 'h e1' },
            do: function (p, send) {
                if (p.e1 % 2 === 0)
                    send(p.e1);
            }
        }
    },
    e3: {
        val: 0,
        stream: {
            async: true,
            with: { e1: 'h e1' },
            do: function (p, send) {
                if (p.e1 % 4 === 0)
                    send(p.e1);
            }
        }
    },
    e4: {
        json: '[]',
        stream: {
            with: {
                e4: 'a',
                e2: 'h e2',
                e3: 'h e3'
            },
            do: function (p) {
                p.e4.push([p.e2, p.e3]);
                return p.e4;
            }
        }
    }
};
var toGraph = runtime.utils.entitySpec.toGraph;
function run(iterations) {
    if (iterations === void 0) { iterations = 100000; }
    var flow = runtime.create();
    flow.addGraph(toGraph(spec));
    var start = Date.now();
    for (var i = 0; i < iterations; i++) {
        flow.set('tick');
    }
    var time = Date.now() - start;
    console.log('iterations', iterations);
    console.log('time', time);
    console.log('==============');
    return time;
}
function test(runs, results) {
    if (runs === void 0) { runs = 20; }
    if (results === void 0) { results = []; }
    if (runs <= 0) {
        var sum = results.reduce(function (a, b) { return a + b; });
        console.log('average time: ', sum / results.length);
        return;
    }
    results.push(run());
    setTimeout(function () {
        test(runs - 1, results);
    }, 10);
}
test();
//# sourceMappingURL=async-filter.js.map