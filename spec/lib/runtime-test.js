import runtime from 'runtime'
import types from 'runtime-types'


describe('Flow runtime', function() {

  var sys;

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
    function p(ports, send) {
      send(ports.bar + 1)
    }

    sys.addGraph({
      entities: [{
        id: "foo"
      }, {
        id: "bar",
        value: 22
      }],
      processes: [{
        id: "lala",
        ports: {bar: sys.PORT_TYPES.HOT},
        procedure: p
      }],
      arcs: [{
        entity: 'bar',
        process: 'lala',
        port: 'bar'
      }, {
        entity: 'foo',
        process: 'lala'
      }],
      meta: {
        foo: "bar"
      }
    })

    sys.start('lala')

    expect(sys.get('foo')).to.equal(23)

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        foo: {
          id: "foo",
          meta: {},
          value: undefined
        },
        bar: {
          id: "bar",
          value: 22,
          meta: {}
        }
      },
      processes: {
        lala: {
          id: "lala",
          ports: {
            bar: "hot"
          },
          code: p.toString(),
          procedure: p,
          autostart: undefined,
          meta: {}
        }
      },
      arcs: {
        "bar->lala::bar": {
          id: "bar->lala::bar",
          entity: "bar",
          process: "lala",
          port: "bar",
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


  describe('entities', function() {

    it('can get and set their values', function() {
      expect(sys.get('fufu')).be.undefined
      sys.set('fufu', 6)
      expect(sys.get('fufu')).to.equal(6)
    })


    it('can be created by set', function() {
      sys.set('foo', 33)

      expect(sys.getGraph().entities.foo).to.exist
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
      expect(sys.getGraph().entities.foo.value).to.be.true
    })


    it('can be removed', function() {
      sys.addEntity({id: 'foo'})
      sys.addArc({id: 'bar', entity: 'foo', process: 'baz'})

      expect(sys.getGraph().entities.foo).to.exist
      expect(sys.getGraph().arcs.bar).to.exist

      sys.removeEntity('foo')

      expect(sys.getGraph().entities.foo).not.to.exist
      expect(sys.getGraph().arcs.bar).not.to.exist
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

      expect(sys.getGraph().arcs.foo).to.exist

      sys.removeArc('foo')

      expect(sys.getGraph().arcs.foo).not.to.exist
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
        code: 'function(input, out) {out("fufu");}'
      }, out = sinon.stub()
      let process = sys.addProcess(spec)
      expect(process.procedure).to.be.a('function')

      process.procedure(null, out)
      expect(out).to.be.calledWith('fufu')
    })


    it('can be removed', function() {
      sys.addProcess({id: 'foo', code: ''})
      sys.addArc({id: 'bar', process: 'foo', entity: 'baz'})
      sys.addArc({id: 'baz', process: 'foooo', entity: 'baz'})

      sys.removeProcess('foo')

      expect(sys.getGraph().processes.foo).not.to.exist
      expect(sys.getGraph().arcs.bar).not.to.exist
      expect(sys.getGraph().arcs.baz).to.exist
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


    it('can add procedures and connections that produce values', function () {
      let procedure = sinon.spy((input, out) => { out('fooValue') })

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
      let procedure = sinon.spy((input, out) => {
        out(input.val + 1)
      })

      sys.addProcess({
        id: 'process',
        ports: {
          'val': sys.PORT_TYPES.HOT
        },
        procedure
      })

      sys.addArc({
        entity: 'src1',
        process: 'process',
        port: 'val'
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('src1', 2)

      expect(sys.get('dest')).to.equal(3)
      expect(procedure.args[0][0]).to.deep.equal({
        'val': 2
      })
    })


    it('gets the accumulator', function() {
      let procedure = sinon.spy((input, out) => {
        out(input.val + 1)
      })

      sys.addProcess({
        id: 'process',
        ports: {
          'val': sys.PORT_TYPES.ACCUMULATOR
        },
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
      const procedure = sinon.spy((input, out) => {
        out(input.val + input.self)
      })
      const procedureEnd = sinon.spy((input, out) => {
        out(input.val + 1000)
      })
      const callback = sinon.stub()
      const ports = {
        val: sys.PORT_TYPES.HOT,
        self: sys.PORT_TYPES.ACCUMULATOR
      }
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
          ports: {val: sys.PORT_TYPES.HOT}
        }],
        arcs: [{
          entity: 'src1',
          process: 'foo',
          port: 'val'
        }, {
          entity: 'src2',
          process: 'bar',
          port: 'val'
        }, {
          process: 'bar',
          entity: 'state',
        }, {
          process: 'foo',
          entity: 'state',
        }, {
          entity: 'state',
          process: 'baz',
          port: 'val'
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

      sys.set('src2', 2)

      expect(sys.get('state')).to.equal(114)
    })


    it('reacts on changes of port type to accumulator', function() {
      const procedure = sinon.spy((input, out) => {
        out(input.val + 1)
      })
      const p = {
        id: 'process',
        ports: {
          val: sys.PORT_TYPES.HOT
        },
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
        port: 'val'
      })

      sys.set('src1', 1)

      expect(sys.get('dest')).to.equal(2)

      sys.removeArc(a.id)

      sys.addProcess({
        ...p,
        ...{ports: {val: sys.PORT_TYPES.ACCUMULATOR}}
      })

      sys.start('process')

      expect(sys.get('dest')).to.equal(3)
    })


    it('have processes that dont react on cold entity ports', function() {
      let procedure = sinon.spy((input, out) => {
        out(input.val1 + input.val2)
      })

      sys.addProcess({
        id: 'process',
        ports: {
          'val1': sys.PORT_TYPES.HOT,
          'val2': sys.PORT_TYPES.COLD
        },
        procedure
      })

      sys.addArc({
        entity: 'src2',
        process: 'process',
        port: 'val2'
      })

      sys.addArc({
        entity: 'src1',
        process: 'process',
        port: 'val1'
      })

      sys.addArc({
        process: 'process',
        entity: 'dest'
      })

      sys.set('src2', 2)

      expect(sys.get('dest')).to.be.undefined
      expect(procedure).to.not.be.called

      sys.set('src1', 3)

      expect(sys.get('dest')).to.equal(5)
      expect(procedure.args[0][0]).to.deep.equal({
        'val1': 3, 'val2': 2
      })
    })


    it('stops propagation on removed arc', function() {
      sys.set('dest', 1)

      sys.addProcess({
        id: 'fooProcess',
        procedure: function(input, out) {
          out(input.val + 1)
        },
        ports: {
          val: sys.PORT_TYPES.ACCUMULATOR
        }
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
      let procedure = sinon.spy((input, out) => {
        out(input.val + 1)
      })

      sys.addProcess({
        id: 'process',
        ports: {
          'val': sys.PORT_TYPES.HOT
        },
        procedure
      })

      let arc = sys.addArc({
        entity: 'src1',
        process: 'process',
        port: 'val'
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


    it('can stop running processes by calling the function returned by a procedure', function() {
      let stop = sinon.stub(),
          procedure = function() { return stop }

      sys.addProcess({
        id: "foo",
        procedure
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
        procedure
      })

      sys.start('foo')

      expect(stop).to.not.be.called

      sys.start('foo')

      expect(stop).to.be.calledOnce

      sys.start('foo')

      expect(stop).to.be.calledTwice
    })


    it('adopts properly to different port changes', function() {
      const p = {
        id: "p",
        procedure: (srcs, sink) => sink(srcs.val + 10),
        ports: {val: sys.PORT_TYPES.HOT}
      }

      sys.addGraph({
        processes: [p],
        arcs: [{
          entity: 'src',
          process: 'p',
          port: 'val'
        }, {
          process: 'p',
          entity: 'dest'
        }]
      })

      sys.set('src', 20)

      expect(sys.get('dest')).to.equal(30)

      sys.addProcess({
        ...p,
        ports: {val: sys.PORT_TYPES.COLD}
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
        ports: {foo: sys.PORT_TYPES.COLD},
        procedure: (srcs, sink) => sink(srcs.foo + 20)
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
        port: 'foo'
      })

      sys.set('src', 0)
      sys.start('p')
      expect(sys.get('dest')).to.equal(20)

      sys.addProcess({
        ...sys.getGraph().processes.p,
        ports: {foo: sys.PORT_TYPES.ACCUMULATOR},
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
        ...sys.getGraph().processes.p,
        ports: {foo: sys.PORT_TYPES.HOT},
      })

      sys.addArc({
        entity: 'src',
        process: 'p',
        port: 'foo'
      })

      sys.set('src', 10)
      expect(sys.get('dest')).to.equal(30)
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
      expect(sys.get('dest')).to.not.be.defined

      sys.addProcess({
        id: "foo",
        procedure: (ports, send) => send(42),
        autostart: true
      })

      expect(sys.get('dest')).to.not.be.defined

      sys.addArc({
        process: "foo",
        entity: "dest"
      })

      expect(sys.get('dest')).to.equal(42)
    })


    it('autostarts only if all ports are connected', function() {
      const procedure = sinon.spy((ports, send) => {
        send(ports.val)
      })

      sys.addProcess({
        id: "foo",
        procedure,
        ports: {
          val: sys.PORT_TYPES.HOT
        },
        autostart: true
      })

      let a = sys.addArc({
        process: "foo",
        entity: "src1",
        port: "val"
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
        process: "foo",
        entity: "src2",
        port: "val"
      })

      expect(procedure).to.be.called
      expect(sys.get('dest')).to.equal('src2_value')
    })


    it('doesnt autostart processes with accumulator port', function() {
      sys.addProcess({
        id: "foo",
        ports: {foo: sys.PORT_TYPES.ACCUMULATOR},
        procedure: (ports, send) => send(42),
        autostart: true
      })

      expect(sys.get('dest')).to.not.be.defined

      sys.addArc({
        process: "foo",
        entity: "dest"
      })

      expect(sys.get('dest')).to.not.be.defined

      sys.addProcess({
        id: "bar",
        ports: {
          bar: sys.PORT_TYPES.ACCUMULATOR,
          foo: sys.PORT_TYPES.HOT
        },
        procedure: (ports, send) => send(ports.foo),
        autostart: true
      })

      sys.addArc({
        process: "bar",
        entity: "dest"
      })

      sys.addArc({
        process: "bar",
        port: "foo",
        entity: "src1"
      })

      expect(sys.get('dest')).to.not.be.defined
    })


    it('doesnt propagate autostart changes on sync execution', function(done) {
      let sys = runtime.create()
      sys.addProcess({
        id: "p2",
        procedure: (ports, send) => send(ports.val + 10),
        ports: {val: sys.PORT_TYPES.HOT}
      })
      sys.addArc({
        entity: "dest",
        process: "p2",
        port: 'val'
      })
      sys.addArc({
        process: "p2",
        entity: "foo"
      })

      sys.addProcess({
        id: "p_auto",
        procedure: (ports, send) => {
          send(42)
        },
        autostart: true
      })
      sys.addArc({
        process: "p_auto",
        entity: "dest"
      })

      expect(sys.get('dest')).to.equal(42)
      expect(sys.get('foo')).to.be.undefined

      setTimeout(function() {
        expect(sys.get('foo')).to.equal(52)
        done()
      }, 40)
    })


    it('propagates changes asynchronously', function(done) {
      sys.addProcess({
        id: "p1",
        procedure: (ports, send) => send(10),
        autostart: true
      })
      sys.addProcess({
        id: "p2",
        procedure: (ports, send) => send(20),
        autostart: true
      })
      sys.addArc({
        entity: "dest",
        process: "p2"
      })
      sys.addArc({
        process: "p1",
        entity: "foo"
      })

      sys.addProcess({
        id: "p_acc",
        ports: {
          foo: sys.PORT_TYPES.HOT,
          self: sys.PORT_TYPES.ACCUMULATOR
        },
        procedure: (ports, send) => {
          send(ports.self + ports.foo)
        }
      })

      sys.addArc({
        process: "p_acc",
        entity: "dest"
      })
      sys.addArc({
        entity: "foo",
        process: "p_acc",
        port: "foo"
      })

      expect(sys.get('dest')).to.equal(20)
      setTimeout(function() {
        expect(sys.get('dest')).to.equal(30)
        done()
      }, 100)
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
        ports: {
          'in': sys.PORT_TYPES.HOT
        },
        procedure: (ports, send) => {
          send(ports.in + 20)
        }
      })
      sys.addArc({
        entity: 'foo',
        process: 'p1',
        port: 'in'
      })
      sys.addArc({
        process: 'p1',
        entity: 'bar'
      })

      sys.set('foo', 22)
      expect(sys.get('bar')).to.equal(42)

      expect(cb).to.be.calledWith(42)
    })


    it('triggers when entity added with new value', function() {
      let cb = sinon.stub()
      sys.on('bar', cb)
      sys.addEntity({id: 'bar', value: 32})

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
          procedure: function (ports, sink) {
            expect(this).to.deep.equal(context)
            sink(42)
          }
        }, {
          id: "p2",
          ports: {val: sys.PORT_TYPES.HOT},
          procedure: function (ports, sink) {
            expect(this).to.deep.equal(context)
            sink('' + ports.val + this.lala)
          }
        }],
        arcs: [{
          process: 'p1',
          entity: 'foo',
        }, {
          entity: 'foo',
          process: 'p2',
          port: 'val'
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
          return (srcs, sink) => {
            sink(42)
          }
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
