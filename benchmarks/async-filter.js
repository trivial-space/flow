const runtime = require('../dist/tvs-flow')


const spec = {
  e1: {
    val: 0,
    stream: {
      with: {
        self: 'a',
        tick: 'h tick' },
      do: p => p.self + 1 } },

  e2: {
    val: 0,
    stream: {
      async: true,
      with: {e1: 'h e1'},
      do: (p, send) => {
        if (p.e1 % 2 === 0) send(p.e1)
      } } },

  e3: {
    val: 0,
    stream: {
      async: true,
      with: {e1: 'h e1'},
      do: (p, send) => {
        if (p.e1 % 4 === 0) send(p.e1)
      } } },

  e4: {
    json: '[]',
    stream: {
      with: {
        e4: 'a',
        e2: 'h e2',
        e3: 'h e3'},
      do: p => {
        p.e4.push([p.e2, p.e3])
        return p.e4
      } } } }


const {toGraph} = runtime.utils.entitySpec


function run(iterations = 100000) {
  const flow = runtime.create()
  flow.addGraph(toGraph(spec))
  // flow.setDebug(true)

  const start = Date.now()

  for (let i = 0; i < iterations; i++) {
    // console.log('e4', flow.get('e4'))
    flow.set('tick')
  }

  const time = Date.now() - start
  console.log('iterations', iterations)
  console.log('time', time)
  //console.log('result e4', flow.get('e4'))
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
