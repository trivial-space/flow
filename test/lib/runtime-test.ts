/// <reference path="../test.d.ts" />
import * as types from '../../lib/runtime-types'
import * as runtime from '../../lib/runtime'


describe('Flow runtime', function() {

  var sys: types.Runtime;

  beforeEach(function() {
    sys = runtime.create()
  })


  it('can return its graph', function() {
    expect(sys.getGraph()).to.deep.equal({
      entities: {},
      processes: {},
      arcs: {},
      meta: {}
    })
  })


  it('can report its current state', function() {
    sys.set('foo', 22)
    sys.set('bar', "barbar")
    sys.set('baz', [1, 2])
    sys.addEntity({id: 'faa'})
    sys.update('baz', function(baz) {baz.push(3); return baz})

    let state = sys.getState()
    expect(state).to.deep.equal({
      foo: 22,
      bar: 'barbar',
      baz: [1, 2, 3],
      faa: undefined
    })
  })


  it('can set and get meta data', function() {
    const meta = {
      foo: "bar"
    }
    sys.setMeta(meta)

    expect(sys.getMeta()).to.deep.equal(meta)
  })


  it('merges new meta to old one', function() {
    sys.setMeta({
      foo: "foo",
      bar: "bar"
    })

    sys.setMeta({
      bar: "baz",
      lala: "lala"
    })

    expect(sys.getMeta()).to.deep.equal({
      foo: "foo",
      bar: "baz",
      lala: "lala"
    })
  })


  it('allows only objects', function() {
    sys.setMeta({
      foo: "foo"
    })

    sys.setMeta(123)
    sys.setMeta([1, 3, 4])
    sys.setMeta(null)
    sys.setMeta(undefined)
    sys.setMeta("bar")

    expect(sys.getMeta()).to.deep.equal({foo: "foo"})
  })


  it('can load and transfer a whole graph', function() {
    let p = bar => bar + 1

    sys.addGraph({
      entities: [{
        id: "foo"
      }, {
        id: "bar",
        value: 22
      }],
      processes: [{
        id: "lala",
        ports: [sys.PORT_TYPES.HOT],
        procedure: p
      }],
      arcs: [{
        entity: 'bar',
        process: 'lala',
        port: 0
      }, {
        process: 'lala',
        entity: 'foo'
      }],
      meta: {
        foo: "bar"
      }
    })

    sys.flush()

    expect(sys.get('foo')).to.equal(23)

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        foo: {
          id: "foo",
          value: undefined,
          json: undefined,
          meta: {}
        },
        bar: {
          id: "bar",
          value: 22,
          json: undefined,
          meta: {}
        }
      },
      processes: {
        lala: {
          id: "lala",
          ports: [sys.PORT_TYPES.HOT],
          code: p.toString(),
          procedure: p,
          autostart: false,
          async: false,
          meta: {}
        }
      },
      arcs: {
        "bar->lala::0": {
          id: "bar->lala::0",
          entity: "bar",
          process: "lala",
          port: 0,
          meta: {}
        },
        "lala->foo": {
          id: "lala->foo",
          entity: "foo",
          process: "lala",
          port: undefined,
          meta: {}
        }
      },
      meta: {
        foo: "bar"
      }
    })

    let sys2 = runtime.create()

    expect(sys2.getGraph()).to.not.deep.equal(sys.getGraph())

    sys2.addGraph(sys.getGraph())

    expect(sys2.getGraph()).to.deep.equal(sys.getGraph())

    sys2.start('lala')

    expect(sys2.get('foo')).to.equal(23)
  })


  it('has a debug mode', function() {
    sinon.spy(console, "log")

    sys.addGraph({
      entities: [{
        id: "foo"
      }, {
        id: "bar",
        value: 22
      }],
      processes: [{
        id: "lala",
        ports: [sys.PORT_TYPES.HOT],
        procedure: bar => bar + 1
      }],
      arcs: [{
        entity: 'bar',
        process: 'lala',
        port: 0
      }, {
        process: 'lala',
        entity: 'foo'
      }]
    })

    sys.setDebug(true)

    sys.set('bar', 1)

    expect(sys.get('foo')).to.equal(2)
    expect((console.log as sinon.SinonSpy).getCall(0).args[0]).to.match(/flush/)
    expect((console.log as sinon.SinonSpy).getCall(1).args[1]).to.match(/lala/)
  })


  describe('entities', function() {

    it('can get and set their values', function() {
      expect(sys.get('fufu')).be.undefined
      sys.set('fufu', 6)
      expect(sys.get('fufu')).to.equal(6)
    })


    it('can be created by set', function() {
      sys.set('foo', 33)

      expect(sys.getGraph().entities['foo']).to.exist
    })


    it('update values by function', function() {
      sys.set('foo', 10)

      sys.update('foo', function(x) {
        return x + 3
      })

      expect(sys.get('foo')).to.equal(13)
    })


    it('can explicitly be added with an initial Value', function() {
      const spec = {
        id: 'foo',
        value: 22
      }
      let entity = sys.addEntity(spec)

      expect(sys.get('foo')).to.equal(22)
      expect(entity.id).to.equal(spec.id)
      expect(entity.value).to.equal(spec.value)
    })


    it('adds falsy but valid values', function() {
      const spec1 = {
        id: 'foo',
        value: false
      }
      const spec2 = {
        id: 'bar',
        value: ""
      }
      const spec3 = {
        id: 'baz',
        value: 0
      }
      sys.addEntity(spec1)
      sys.addEntity(spec2)
      sys.addEntity(spec3)

      expect(sys.get('foo')).to.equal(false)
      expect(sys.get('bar')).to.equal("")
      expect(sys.get('baz')).to.equal(0)
    })


    it("doesn't set the current value if already present", function() {
      sys.set('foo', false)
      sys.addEntity({id: 'foo', value: true})

      expect(sys.get('foo')).to.be.false
      expect(sys.getGraph().entities['foo'].value).to.be.true
    })


    it('can be removed', function() {
      sys.addEntity({id: 'foo'})
      sys.addArc({id: 'bar', entity: 'foo', process: 'baz'})

      expect(sys.getGraph().entities['foo']).to.exist
      expect(sys.getGraph().arcs['bar']).to.exist

      sys.removeEntity('foo')

      expect(sys.getGraph().entities['foo']).not.to.exist
      expect(sys.getGraph().arcs['bar']).not.to.exist
    })


    it('can evaluate a json string as initial value', function() {
      sys.addEntity({
        id: 'foo',
        json: '{"foo": 23, "bar": 42}'
      })

      expect(sys.get('foo')).to.deep.equal({
        foo: 23,
        bar: 42
      })
    })
  })


  describe('arcs', function() {

    it('can be added', function() {
      const spec = {
        process: 'fufu',
        entity: 'bar'
      }
      let arc = sys.addArc(spec)
      expect(arc.id).to.be.a('string')

      expect(sys.getGraph().arcs[arc.id]).to.exist
    })


    it('can be removed', function() {
      sys.addArc({id: 'foo', process: 'bar', entity: 'baz'})

      expect(sys.getGraph().arcs['foo']).to.exist

      sys.removeArc('foo')

      expect(sys.getGraph().arcs['foo']).not.to.exist
    })
  })


  describe('processes', function() {

    it('can be added', function() {
      const spec = { code: '"kuku"' }
      let process = sys.addProcess(spec)
      expect(process.id).to.be.a('string')
      expect(process.code).to.equal(spec.code)

      expect(sys.getGraph().processes[process.id]).to.exist
    })


    it('can evaluate code into a procedure', function() {
      const spec = {
        code: 'function(send) {send("fufu");}',
      }
      const send = sinon.stub()

      let process = sys.addProcess(spec)
      expect(process.procedure).to.be.a('function')

      const p: any = process.procedure
      p(send)
      expect(send).to.be.calledWith('fufu')
    })


    it('can be removed', function() {
      sys.addProcess({id: 'foo', code: '123'})
      sys.addArc({id: 'bar', process: 'foo', entity: 'baz'})
      sys.addArc({id: 'baz', process: 'foooo', entity: 'baz'})

      sys.removeProcess('foo')

      expect(sys.getGraph().processes['foo']).not.to.exist
      expect(sys.getGraph().arcs['bar']).not.to.exist
      expect(sys.getGraph().arcs['baz']).to.exist
    })
  })


  describe('dataflow', function() {

    const src1 = {
      id: 'src1',
      value: 'src1_value'
    }
    const src2 = {
      id: 'src2',
      value: 'src2_value'
    }
    const dest = {
      id: 'dest'
    }

    beforeEach(function () {
      sys.addEntity(src1)
      sys.addEntity(src2)
      sys.addEntity(dest)
    })


    it('does not reset state on initial values', function() {
      sys.addEntity({
        id: 'dest',
        value: 20
      })
      sys.addEntity({
        id: 'foo',
        value: 10
      })

      sys.addProcess({
        id: "p_acc",
        ports: [
          sys.PORT_TYPES.HOT,
          sys.PORT_TYPES.ACCUMULATOR
        ],
        procedure: (foo, self) => self + foo
      })

      sys.addArc({
        process: "p_acc",
        entity: "dest"
      })
      sys.addArc({
        entity: "foo",
        process: "p_acc",
        port: 0
      })

      expect(sys.get('dest')).to.equal(20)

      sys.flush()

      expect(sys.get('dest')).to.equal(30)

      sys.set('foo', 11)

      expect(sys.get('dest')).to.equal(41)
    })


    it('can add procedures and connections that produce values', function () {
      let procedure = sinon.spy(() => 'fooValue')

      sys.addProcess({
        id: 'fooProcess',
        procedure
      })

      sys.addArc({
        process: 'fooProcess',
        entity: 'dest'
      })

      expect(procedure).not.to.be.called
      expect(sys.get('dest')).to.not.exist

      sys.start('fooProcess')

      expect(procedure).to.be.called
      expect(sys.get('dest')).to.equal('fooValue')
    })


    it('have processes that react on hot entity ports', function() {
      let procedure = sinon.spy(val => val + 1)

      sys.addProcess({
        id: 'process',
        ports: [sys.PORT_TYPES.HOT],
        procedure
      })

      sys.addArc({
        entity: 'src1',
        process: 'process',
        port: 0
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('src1', 2)

      expect(sys.get('dest')).to.equal(3)
      expect(procedure.args[0][0]).to.deep.equal(2)
    })


    it('gets the accumulator', function() {
      let procedure = sinon.spy(val => val + 1)

      sys.addProcess({
        id: 'process',
        ports: [sys.PORT_TYPES.ACCUMULATOR],
        procedure
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('dest', 1)

      expect(sys.get('dest')).to.equal(2)
      sys.start('process')
      expect(sys.get('dest')).to.equal(3)
      sys.start('process')
      expect(sys.get('dest')).to.equal(4)

      expect(procedure).to.be.calledThrice
    })


    it('runs all connected accumulator processes when entity is reset', function() {
      const procedure = sinon.spy((self, val) => val + self)
      const procedureEnd = sinon.spy(val => val + 1000)
      const callback = sinon.stub()
      const ports = [
        sys.PORT_TYPES.ACCUMULATOR,
        sys.PORT_TYPES.HOT,
      ]
      sys.set('src1', 5)
      sys.set('src2', 7)
      sys.addGraph({
        entities: [{
          id: "state"
        }],
        processes: [{
          id: "foo",
          procedure, ports
        }, {
          id: "bar",
          procedure, ports
        }, {
          id: "baz",
          procedure: procedureEnd,
          ports: [sys.PORT_TYPES.HOT]
        }],
        arcs: [{
          entity: 'src1',
          process: 'foo',
          port: 1
        }, {
          entity: 'src2',
          process: 'bar',
          port: 1
        }, {
          process: 'bar',
          entity: 'state',
        }, {
          process: 'foo',
          entity: 'state',
        }, {
          entity: 'state',
          process: 'baz',
          port: 0
        }, {
          process: 'baz',
          entity: 'dest',
        }]
      })

      sys.on('state', callback)

      sys.set('state', 100)

      expect(sys.get('state')).to.equal(112)
      expect(sys.get('dest')).to.equal(1112)

      expect(procedure).to.be.calledTwice
      expect(procedureEnd).to.be.calledOnce
      expect(callback).to.be.calledOnce
      expect(callback).to.be.calledWith(112)

      procedure.reset()
      procedureEnd.reset()
      callback.reset()

      sys.set('src2', 2)

      expect(procedure).to.be.calledOnce
      expect(procedureEnd).to.be.calledOnce
      expect(callback).to.be.calledOnce
      expect(callback).to.be.calledWith(114)

      expect(sys.get('state')).to.equal(114)
    })


    it('reacts on changes of port type to accumulator', function() {
      const procedure = sinon.spy(val => val + 1)
      const p = {
        id: 'process',
        ports: [sys.PORT_TYPES.HOT],
        procedure
      }

      sys.addProcess(p)

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      let a = sys.addArc({
        process: 'process',
        entity: 'src1',
        port: 0
      })

      sys.set('src1', 1)

      expect(sys.get('dest')).to.equal(2)

      sys.removeArc(a.id)

      sys.addProcess({
        ...p,
        ports: [sys.PORT_TYPES.ACCUMULATOR]
      })

      sys.start('process')

      expect(sys.get('dest')).to.equal(3)
    })


    it('doesnt activate accumulator processes and doesnt propagate unless accumulator entity is defined', function() {
      const p = sinon.spy((v, acc) => acc + v)
      sys.addGraph({
        processes: [{
          id: 'p1',
          ports: [sys.PORT_TYPES.HOT, sys.PORT_TYPES.ACCUMULATOR],
          procedure: p
        }, {
          id: 'p2',
          ports: [sys.PORT_TYPES.HOT],
          procedure: v => v + v
        }],
        arcs: [{
          process: 'p1',
          entity: 'dest'
        }, {
          entity: 'src1',
          process: 'p1',
          port: 0
        }, {
          process: 'p2',
          entity: 'dest'
        }, {
          entity: 'start',
          process: 'p2',
          port: 0
        }]
      })

      sys.flush()

      expect(p).to.not.be.called
      expect(sys.get('dest')).to.be.undefined

      sys.set('start', 22)

      expect(p).to.be.calledWith('src1_value', 44)
      expect(sys.get('dest')).to.equal('44src1_value')
    })


    it('have processes that dont react on cold entity ports', function() {
      let procedure = sinon.spy((val1, val2) => val1 + val2)

      sys.addProcess({
        id: 'process',
        ports: [
          sys.PORT_TYPES.HOT,
          sys.PORT_TYPES.COLD
        ],
        procedure
      })

      sys.addArc({
        entity: 'src_2',
        process: 'process',
        port: 1
      })

      sys.addArc({
        entity: 'src_1',
        process: 'process',
        port: 0
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('src_2', 2)

      expect(sys.get('dest')).to.be.undefined
      expect(procedure).to.not.be.called

      sys.set('src_1', 3)

      expect(sys.get('dest')).to.equal(5)
      expect(procedure.args[0]).to.deep.equal([3, 2])
    })


    it('stops propagation on removed arc', function() {
      sys.set('dest', 1)

      sys.addProcess({
        id: 'fooProcess',
        procedure: val => val + 1,
        ports: [sys.PORT_TYPES.ACCUMULATOR]
      })

      let arc = sys.addArc({
        process: 'fooProcess',
        entity: 'dest'
      })

      sys.start('fooProcess')

      expect(sys.get('dest')).to.equal(2)

      sys.removeArc(arc.id)
      sys.start('fooProcess')

      expect(sys.get('dest')).to.equal(2)
    })


    it('stops on removed arc2', function() {
      let procedure = sinon.spy(val => val + 1)

      sys.addProcess({
        id: 'process',
        ports: [sys.PORT_TYPES.HOT],
        procedure
      })

      let arc = sys.addArc({
        entity: 'src1',
        process: 'process',
        port: 0
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('src1', 2)

      expect(sys.get('dest')).to.equal(3)

      sys.removeArc(arc.id)
      sys.set('src1', 3)

      expect(sys.get('dest')).to.equal(3)
      expect(procedure).to.be.calledOnce
    })


    it('adopts properly to different port changes', function() {
      const p = {
        id: "p",
        procedure: val => val + 10,
        ports: [sys.PORT_TYPES.HOT]
      }

      sys.addGraph({
        processes: [p],
        arcs: [{
          entity: 'src',
          process: 'p',
          port: 0
        }, {
          process: 'p',
          entity: 'dest'
        }]
      })

      sys.set('src', 20)

      expect(sys.get('dest')).to.equal(30)

      sys.addProcess({
        ...p,
        ports: [sys.PORT_TYPES.COLD]
      })

      sys.set('src', 10)
      expect(sys.get('dest')).to.equal(30)

      sys.start('p')

      expect(sys.get('dest')).to.equal(20)

      sys.addProcess(p)

      sys.set('src', 40)
      expect(sys.get('dest')).to.equal(50)

      sys.addProcess({
        id: 'p',
        ports: [],
        procedure: (foo = 0) => foo + 20
      })

      expect(sys.getGraph().arcs).to.deep.equal({
        'p->dest': types.createArc({
          process: 'p',
          entity: 'dest'
        })
      })

      sys.addArc({
        entity: 'src',
        process: 'p',
        port: 0
      })

      sys.set('src', 2000)
      sys.start('p')
      expect(sys.get('dest')).to.equal(20)

      sys.addProcess({
        ...sys.getGraph().processes['p'],
        ports: [sys.PORT_TYPES.ACCUMULATOR],
      })

      expect(sys.getGraph().arcs).to.deep.equal({
        'p->dest': types.createArc({
          process: 'p',
          entity: 'dest'
        })
      })

      sys.start('p')

      expect(sys.get('dest')).to.equal(40)

      sys.addProcess({
        ...sys.getGraph().processes['p'],
        ports: [sys.PORT_TYPES.HOT]
      })

      sys.addArc({
        entity: 'src',
        process: 'p',
        port: 0
      })

      sys.set('src', 10)
      expect(sys.get('dest')).to.equal(30)
    })


    it('executes hot processes before accumulator processes', function() {
      sys.addGraph({
        processes: [{
          id: "p1",
          ports: [
            sys.PORT_TYPES.ACCUMULATOR,
            sys.PORT_TYPES.HOT
          ],
          procedure: (self, val) => self + '-' + val
        }, {
          id: "p2",
          ports: [sys.PORT_TYPES.HOT],
          procedure: val => val
        }],
        arcs: [{
          entity: "src1",
          process: "p1",
          port: 1
        }, {
          entity: "src2",
          process: "p2",
          port: 0
        }, {
          process: "p1",
          entity: "dest"
        }, {
          process: "p2",
          entity: "dest"
        }]
      })

      sys.flush()

      expect(sys.get('dest')).to.equal('src2_value-src1_value')
    })


    it('runs processes only if all entities on connected ports have defined values', function() {
      const p1 = sinon.spy((v1, v2, v3) => v1 + v2 + v3)
      const p2 = sinon.spy((self, foo) => self + foo)
      const p3 = sinon.stub()
      sys.addGraph({
        processes: [{
          id: 'p1',
          ports: [
            sys.PORT_TYPES.HOT,
            sys.PORT_TYPES.HOT,
            sys.PORT_TYPES.COLD
          ],
          procedure: p1
        }, {
          id: 'p2',
          ports: [
            sys.PORT_TYPES.ACCUMULATOR,
            sys.PORT_TYPES.HOT
          ],
          procedure: p2
        }, {
          id: 'p3',
          ports: [
            sys.PORT_TYPES.HOT
          ],
          procedure: p3
        }],
        arcs: [{
          process: 'p1',
          entity: 'dest'
        }, {
          entity: 'e1',
          process: 'p1',
          port: 0
        }, {
          entity: 'e2',
          process: 'p1',
          port: 1
        }, {
          entity: 'e3',
          process: 'p1',
          port: 2
        }, {
          process: 'p2',
          entity: 'dest'
        }, {
          entity: 'e4',
          process: 'p2',
          port: 1
        }, {
          entity: 'dest',
          process: 'p3',
          port: 0
        }]
      })

      sys.set('e1', 10)
      expect(p1).not.to.be.called
      expect(p2).not.to.be.called
      expect(p3).not.to.be.called

      sys.set('e3', 30)
      expect(p1).not.to.be.called
      expect(p2).not.to.be.called
      expect(p3).not.to.be.called

      sys.set('e2', 20)
      expect(p1).to.be.calledOnce
      expect(p2).not.to.be.called
      expect(p3).to.be.calledOnce
      expect(p3).to.be.calledWith(60)
      expect(sys.get('dest')).to.equal(60)

      p1.reset()
      p2.reset()
      p3.reset()

      sys.set('e4', 10)
      expect(sys.get('dest')).to.equal(70)
      expect(p1).not.to.be.called
      expect(p2).to.be.calledOnce
      expect(p3).to.be.calledOnce
      expect(p3).to.be.calledWith(70)

      p1.reset()
      p2.reset()
      p3.reset()

      sys.set('e1', undefined)
      expect(p1).not.to.be.called
      expect(p2).not.to.be.called
      expect(p3).not.to.be.called

      sys.set('e4', 30)
      expect(sys.get('dest')).to.equal(100)
      expect(p1).not.to.be.called
      expect(p2).to.be.calledOnce
      expect(p3).to.be.calledOnce
      expect(p3).to.be.calledWith(100)

      p1.reset()
      p2.reset()
      p3.reset()

      sys.set('e1', 10)
      expect(p1).to.be.calledOnce
      expect(p2).to.be.calledOnce
      expect(p3).to.be.calledOnce
      expect(p3).to.be.calledWith(90)
      expect(sys.get('dest')).to.equal(90)
    })


    it('can be canceled by returning undefined from process', function() {
      const acc = sinon.spy((self, val) => [...self, val])
      const filter = sinon.spy(v => (v % 2) === 0 ? v : null)

      sys.addGraph({
        entities: [{
          id: 'dest',
          value: []
        }],
        processes: [{
          id: 'acc',
          ports: [sys.PORT_TYPES.ACCUMULATOR, sys.PORT_TYPES.HOT],
          procedure: acc
        }, {
          id: 'filter',
          ports: [sys.PORT_TYPES.HOT],
          procedure: filter
        }],
        arcs: [{
          entity: 'src',
          process: 'filter',
          port: 0
        }, {
          process: 'filter',
          entity: 'result'
        }, {
          entity: 'result',
          process: 'acc',
          port: 1
        }, {
          process: 'acc',
          entity: 'dest'
        }]
      })

      sys.set('src', 1)
      sys.set('src', 2)
      sys.set('src', 3)
      sys.set('src', 4)
      sys.set('src', 5)
      sys.set('src', 6)

      expect(sys.get('dest')).to.deep.equal([2, 4, 6])
      expect(filter.callCount).to.equal(6)
      expect(acc.callCount).to.equal(3)
    })
  })


  describe('async processes', function() {

    it('can stop running async processes by calling the function returned by a procedure', function() {
      let stop = sinon.stub(),
          procedure = function() { return stop }

      sys.addProcess({
        id: "foo",
        procedure,
        async: true
      })

      sys.start('foo')

      expect(stop).to.not.be.called

      sys.stop('foo')

      expect(stop).to.be.called

      sys.stop('foo')
      sys.stop('foo')

      expect(stop).to.be.calledOnce
    })


    it('stops running processes before restarting', function() {
      let stop = sinon.stub(),
          procedure = function() { return stop }

      sys.addProcess({
        id: "foo",
        async: true,
        procedure
      })

      sys.start('foo')

      expect(stop).to.not.be.called

      sys.start('foo')

      expect(stop).to.be.calledOnce

      sys.start('foo')

      expect(stop).to.be.calledTwice
    })


    it('stops propagation on removed arc', function() {
      const cancel = sinon.stub()
      sys.set('dest', 1)

      sys.addProcess({
        id: 'fooProcess',
        procedure: (out, val) => {
          out(val + 1)
          return cancel
        },
        async: true,
        ports: [sys.PORT_TYPES.HOT]
      })

      let arc = sys.addArc({
        process: 'fooProcess',
        entity: 'dest'
      })
      sys.addArc({
        entity: 'src1',
        process: 'fooProcess',
        port: 0
      })

      sys.set('src1', 1)

      expect(sys.get('dest')).to.equal(2)

      expect(cancel).to.not.be.called

      sys.removeArc(arc.id)

      expect(cancel).to.be.called

      sys.set('src1', 4)

      expect(sys.get('dest')).to.equal(2)
    })


    it('stop when removed async', function() {
      let cleanup = sinon.stub()
      sys.addProcess({
        id: 'foo',
        async: true,
        procedure: send => {
          send(42)
          return cleanup
        }
      })

      sys.start('foo')

      expect(cleanup).to.not.be.called

      sys.removeProcess('foo')

      expect(cleanup).to.be.called
    })


    it('flow propagates to async processes', function() {
      sys.addGraph({
        processes: [{
          id: "p1",
          autostart: true,
          procedure: () => 42
        }, {
          id: "p2",
          async: true,
          ports: [sys.PORT_TYPES.HOT],
          procedure: (send, val) => send(val)
        }],
        arcs: [{
          process: "p1",
          entity: "src1"
        }, {
          entity: "src1",
          process: "p2",
          port: 0
        }, {
          process: "p2",
          entity: "dest"
        }]
      })

      sys.flush()

      expect(sys.get('dest')).to.equal(42)
    })


    it('entities that are updated by async processes at the same time propagate only once', function() {
      const p = sinon.spy((self, val1, val2) => [...self, [val1, val2]])
      sys.addGraph({
        entities: [{
          id: 'dest',
          value: []
        }, {
          id: 'src',
          value: 'source'
        }],
        processes: [{
          id: "p1",
          async: true,
          ports: [sys.PORT_TYPES.HOT],
          procedure: (out, val) => out(val + 10)
        }, {
          id: "p2",
          async: true,
          ports: [sys.PORT_TYPES.HOT],
          procedure: (out, val) => out(val + 20)
        }, {
          id: "p3",
          ports: [
            sys.PORT_TYPES.ACCUMULATOR,
            sys.PORT_TYPES.HOT,
            sys.PORT_TYPES.HOT
          ],
          procedure: p
        }],
        arcs: [{
          entity: "src",
          process: "p1",
          port: 0
        }, {
          entity: "src",
          process: "p2",
          port: 0
        }, {
          process: "p2",
          entity: "e2",
        }, {
          process: "p1",
          entity: "e1",
        }, {
          entity: "e1",
          process: "p3",
          port: 1
        }, {
          entity: "e2",
          process: "p3",
          port: 2
        }, {
          process: "p3",
          entity: "dest"
        }]
      })

      sys.flush()

      expect(p).to.be.calledOnce
      expect(sys.get('dest')).to.deep.equal([['source10', 'source20']])
    })
  })


  describe('autostart of processes', function() {

    const src1 = {
      id: 'src1',
      value: 'src1_value'
    }
    const src2 = {
      id: 'src2',
      value: 'src2_value'
    }
    const dest = {
      id: 'dest'
    }

    beforeEach(function () {
      sys.addEntity(src1)
      sys.addEntity(src2)
      sys.addEntity(dest)
    })


    it('autostarts processes when all ports connected', function() {
      expect(sys.get('dest')).to.be.undefined

      sys.addProcess({
        id: "foo",
        procedure: () => 42,
        autostart: true
      })

      expect(sys.get('dest')).to.be.undefined

      sys.addArc({
        process: "foo",
        entity: "dest"
      })

      expect(sys.get('dest')).to.equal(42)
    })


    it('autostarts only if all ports are connected', function() {
      const procedure = sinon.spy(val => val)

      sys.addProcess({
        id: "foo",
        procedure,
        ports: [sys.PORT_TYPES.HOT],
        autostart: true
      })

      let a = sys.addArc({
        entity: "src1",
        process: "foo",
        port: 0
      })

      expect(procedure).to.not.be.called

      sys.addArc({
        process: "foo",
        entity: "dest",
      })

      expect(procedure).to.be.called
      expect(sys.get('dest')).to.equal('src1_value')

      procedure.reset()

      sys.removeArc(a.id)

      expect(procedure).to.not.be.called

      sys.addArc({
        entity: "src2",
        process: "foo",
        port: 0
      })

      expect(procedure).to.be.called
      expect(sys.get('dest')).to.equal('src2_value')
    })


    it('doesnt autostart processes with accumulator port', function() {
      sys.addProcess({
        id: "foo",
        ports: [sys.PORT_TYPES.ACCUMULATOR],
        procedure: () => 42,
        autostart: true
      })

      expect(sys.get('dest')).to.be.undefined

      sys.addArc({
        process: "foo",
        entity: "dest"
      })

      expect(sys.get('dest')).to.be.undefined

      sys.addProcess({
        id: "bar",
        ports: [
          sys.PORT_TYPES.ACCUMULATOR,
          sys.PORT_TYPES.HOT
        ],
        procedure: (_, foo) => foo,
        autostart: true
      })

      sys.addArc({
        process: "bar",
        entity: "dest"
      })

      sys.addArc({
        process: "bar",
        port: 1,
        entity: "src1"
      })

      expect(sys.get('dest')).to.be.undefined
    })


    it('doesnt propagate async autostart changes on sync execution', function(done) {
      let sys = runtime.create()
      sys.addProcess({
        id: "p2",
        procedure: val => val + 10,
        ports: [sys.PORT_TYPES.HOT]
      })
      sys.addArc({
        entity: "dest",
        process: "p2",
        port: 0
      })
      sys.addArc({
        process: "p2",
        entity: "foo"
      })

      sys.addProcess({
        id: "p_auto",
        procedure: send => send(42),
        async: true,
        autostart: true
      })
      sys.addArc({
        process: "p_auto",
        entity: "dest"
      })

      expect(sys.get('dest')).to.undefined
      expect(sys.get('foo')).to.be.undefined

      setTimeout(function() {
        expect(sys.get('dest')).to.equal(42)
        expect(sys.get('foo')).to.equal(52)
        done()
      }, 100)
    })


    it('propagates changes on first flush', function() {
      sys.addProcess({
        id: "p1",
        procedure: () => 10,
        autostart: true
      })
      sys.addProcess({
        id: "p2",
        procedure: () => 20,
        autostart: true
      })
      sys.addArc({
        process: "p2",
        entity: "dest"
      })
      sys.addArc({
        process: "p1",
        entity: "foo"
      })

      sys.addProcess({
        id: "p_acc",
        ports: [
          sys.PORT_TYPES.HOT,
          sys.PORT_TYPES.ACCUMULATOR
        ],
        procedure: (foo, self) => self + foo
      })

      sys.addArc({
        process: "p_acc",
        entity: "dest"
      })
      sys.addArc({
        entity: "foo",
        process: "p_acc",
        port: 0
      })

      expect(sys.get('dest')).to.equal(20)

      sys.flush()

      expect(sys.get('dest')).to.equal(30)

      sys.set('foo', 11)

      expect(sys.get('dest')).to.equal(41)
    })


    it('doesnt execute on process update', function() {
      const procedure = sinon.stub()
      const process = {
        id: "foo",
        procedure,
        ports: [sys.PORT_TYPES.HOT],
        autostart: true
      }

      sys.addProcess(process)

      sys.addArc({
        process: 'foo',
        entity: 'dest'
      })

      sys.addArc({
        entity: 'src1',
        process: 'foo',
        port: 0
      })

      expect(procedure).to.be.called

      procedure.reset()

      sys.addProcess(process)

      expect(procedure).to.not.be.called
    })
  })


  describe("execution order", function() {

    it('propagates level by level', function() {
      let p1 = sinon.spy(val => val)
      let p2 = sinon.spy(val => val)
      let p3 = sinon.spy(val => val)
      let p4 = sinon.spy(val => val)
      let ports = [sys.PORT_TYPES.HOT]

      sys.addGraph({
        entities: [{ id: "src" }, { id: "e1" }, { id: "e2" }],
        processes: [{
          id: "p1",
          procedure: p1,
          ports
        }, {
          id: "p2",
          procedure: p2,
          ports
        }, {
          id: "p3",
          procedure: p3,
          ports
        }, {
          id: "p4",
          procedure: p4,
          ports
        }],
        arcs: [{
          entity: "src",
          process: "p1",
          port: 0
        }, {
          entity: "src",
          process: "p2",
          port: 0
        }, {
          process: "p1",
          entity: "e1",
        }, {
          process: "p2",
          entity: "e2",
        }, {
          entity: "e1",
          process: "p3",
          port: 0
        }, {
          entity: "e2",
          process: "p4",
          port: 0
        }]
      })

      sys.set('src', true)

      expect(p1).to.be.called
      expect(p2).to.be.called
      expect(p3).to.be.called
      expect(p4).to.be.called

      expect(p1.calledBefore(p3)).to.be.true
      expect(p1.calledBefore(p4)).to.be.true
      expect(p2.calledBefore(p3)).to.be.true
      expect(p2.calledBefore(p4)).to.be.true
    })
  })


  describe('callbacks', function() {

    it('can be registered and unregistered', function() {
      let cb = sinon.stub()
      sys.on('foo', cb)
      expect(cb).to.not.be.called

      sys.set('foo', 22)

      expect(cb).to.be.calledWith(22)
      cb.reset()

      sys.off('foo')

      sys.set('foo', 12)
      expect(cb).to.not.be.called
    })


    it('triggers on propagation', function() {
      let cb = sinon.stub()
      sys.on('bar', cb)
      sys.addEntity({id: 'bar'})
      sys.addEntity({id: 'foo'})
      sys.addProcess({
        id: 'p1',
        ports: [sys.PORT_TYPES.HOT],
        procedure: val => val + 20
      })
      sys.addArc({
        entity: 'foo',
        process: 'p1',
        port: 0
      })
      sys.addArc({
        process: 'p1',
        entity: 'bar'
      })

      sys.set('foo', 22)
      expect(sys.get('bar')).to.equal(42)

      expect(cb).to.be.calledWith(42)
    })


    it('triggers when entity set with new value', function() {
      let cb = sinon.stub()
      sys.on('bar', cb)
      sys.set('bar', 32)

      expect(cb).to.be.calledWith(32)
    })
  })


  describe('context', function() {

    const context = {
      foo: 'bar',
      lala: 'fufu'
    }

    beforeEach(function() {
      sys.setContext(context)
    })

    it('can be set and get', function() {
      expect(sys.getContext()).to.deep.equal(context)
    })


    it('is available during every process execution', function() {
      sys.addGraph({
        processes: [{
          id: "p1",
          procedure: function () {
            expect(this).to.deep.equal(context)
            return 42
          }
        }, {
          id: "p2",
          ports: [sys.PORT_TYPES.HOT],
          procedure: function (val) {
            expect(this).to.deep.equal(context)
            return '' + val + this.lala
          }
        }],
        arcs: [{
          process: 'p1',
          entity: 'foo',
        }, {
          entity: 'foo',
          process: 'p2',
          port: 0
        }, {
          process: 'p2',
          entity: 'bar',
        }]
      })

      sys.start('p1')

      expect(sys.get('bar')).to.equal('42fufu')
    })


    it('is available in procedure generation code', function() {
      sys.setContext({
        createProcedure: function() {
          return () => 42
        }
      })

      sys.addProcess({
        id: 'p',
        code: 'this.createProcedure()'
      })

      sys.addArc({
        process: 'p',
        entity: 'foo'
      })

      sys.start('p')
      expect(sys.get('foo')).to.equal(42)
    })
  })
})
