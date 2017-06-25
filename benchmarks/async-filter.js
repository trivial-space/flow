const runtime = require('../dist/tvs-flow')

const { val, asyncStream, getGraphFromAll, resolveEntityIds } = runtime.utils.entityRef


function setupFlow (flow) {

	const tick = val()

	const e1 = val(0)
	.react(
		[tick.HOT],
		(self, tick) => self + tick
	)

	const e2 = asyncStream(
		[e1.HOT],
		(send, e1) => {
			if (e1 % 2 === 0) send(e1)
		}
	)

	const e3 = asyncStream(
		[e1.HOT],
		(send, e1) => {
			if (e1 % 4 === 0) send(e1)
		}
	)

	const e4 = val([])
	.react(
		[e2.HOT, e3.HOT],
		(self, e2, e3) => {
			self.push([e2, e3])
			return self
		}
	)

	flow.addGraph(
		getGraphFromAll(
			resolveEntityIds(
				{ tick, e1, e2, e3, e4 })))
}


function run (iterations = 100000) {
	const flow = runtime.create()
	setupFlow(flow)
	// flow.setDebug(true)

	const start = Date.now()

	for (let i = 0; i < iterations; i++) {
		//console.log('e4', flow.get('e4'))
		flow.set('tick', 1)
	}

	const time = Date.now() - start
	console.log('iterations', iterations)
	console.log('time', time)
	//console.log('result e4', flow.get('e4'))
	console.log('==============')
	return time
}


function test (runs = 20, results = []) {
	if (runs <= 0) {
		const sum = results.reduce((a, b) => a + b)
		console.log('average time: ', sum / results.length)
		return
	}

	results.push(run())

	setTimeout(function() {
		test(runs - 1, results)
	}, 10)
}

test()
