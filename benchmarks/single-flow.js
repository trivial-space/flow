const runtime = require('../dist/tvs-flow')


const spec = {
  e1: {
    val: 0,
    stream: {
      deps: {
        self: 'A',
        tick: 'H tick' },
      do: ports => ports.self++ } },

  e2: {
    stream: {
      deps: {e1: 'h e1'},
      do: p => p.e1 * 10 } },

  e3: {
    val: [],
    stream: {
      deps: {
        e3: 'a',
        e2: 'h e2'},
      do: p => {
        p.e3.push(p.e2)
        return p.e3
      } } },

  e4: {
    stream: {
      deps: {e3: 'h e3'},
      do: p => p.e3.length } } }


const {toGraph} = runtime.utils.entitySpec


function run(iterations = 100000) {
  const flow = runtime.create()
  flow.addGraph(toGraph(spec))

  const start = Date.now()

  for (let i = 0; i < iterations; i++) {
    flow.set('tick')
  }

  const time = Date.now() - start
  console.log('iterations', iterations)
  console.log('time', time)
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
  }, 100)
}

test(10)
