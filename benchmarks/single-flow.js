const runtime = require('../dist/tvs-flow')


function setupFlow(flow) {

  const {val, stream, addToFlow} = runtime.utils.entityRef.create(flow)

  const tick = val()

  const e1 = val(0)
    .react(
      [tick.HOT],
      (self, tick) => self + tick
    )

  const e2 = stream(
    [e1.HOT],
    e1 => e1 * 10 + 4
  )

  const e3 = val([])
    .react(
      [e2.HOT],
      (self, e2) => {
        self.push(e2)
        return self
      }
    )

  const e4 = stream(
    [e3.HOT],
    e3 => e3.length
  )

  addToFlow({tick, e1, e2, e3, e4})
}



function run(iterations = 100000) {
  const flow = runtime.create()
  setupFlow(flow)

  const start = Date.now()

  for (let i = 0; i < iterations; i++) {
    flow.set('tick', 1)
  }

  const time = Date.now() - start
  console.log('iterations', iterations)
  console.log('time', time)
  // console.log('result e1', flow.get('e1'))
  // console.log('result e2', flow.get('e2'))
  // console.log('result e3', flow.get('e3'))
  console.log('result e4', flow.get('e4'))
  console.log('==============')
  return time
}


function test(runs = 20, results = []) {
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
