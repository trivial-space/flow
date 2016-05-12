import runtime from 'runtime'


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


  it('can load a whole graph Spec', function() {
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
        procedure: function(ports, send) {
          send(ports.bar + 1)
        }
      }],
      arcs: [{
        entity: 'bar',
        process: 'lala',
        port: 'bar'
      }, {
        entity: 'foo',
        process: 'lala'
      }]
    })

    sys.start('lala')

    expect(sys.get('foo')).to.equal(23)
  })


  describe('entities', function() {

    it('can get and set their values', function() {
      expect(sys.get('fufu')).be.undefined
      sys.set('fufu', 6)
      expect(sys.get('fufu')).to.equal(6)
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

      expect(procedure).to.not.be.called

      sys.start('process')
      expect(sys.get('dest')).to.equal(2)
      sys.start('process')
      expect(sys.get('dest')).to.equal(3)
      sys.start('process')
      expect(sys.get('dest')).to.equal(4)

      expect(procedure).to.be.calledThrice
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
          send(ports.in + 10)
        }
      })
      sys.addArc({
        entity: 'foo',
        process: 'p1',
        port: 'in'
      })
      sys.addArc({
        entity: 'bar',
        process: 'p1'
      })

      sys.set('foo', 22)

      expect(cb).to.be.calledWith(32)
    })
  })
})
