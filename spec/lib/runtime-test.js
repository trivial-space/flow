import runtime from 'runtime'
import runtimeTypes from 'runtime-types'


describe('Flow runtime', function() {

  var sys;

  beforeEach(function() {
    sys = runtime.create()
  })


  describe('entities', function() {

    it('can be get and set', function() {
      expect(sys.get('fufu')).be.undefined
      sys.set('fufu', 6)
      expect(sys.get('fufu')).to.equal(6)
    })


    it('update by function', function() {
      sys.set('foo', 10)

      sys.update('foo', function(x) {
        return x + 3
      })

      expect(sys.get('foo')).to.equal(13)
    })


    it('can explicitly be added with an initial Value', function() {
      sys.addEntity({
        id: 'foo',
        value: 22
      })

      expect(sys.get('foo')).to.equal(22)
    })
  })


  describe('processes', function() {

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

      expect(procedure).not.to.be.called

      expect(procedure).not.to.be.called

      sys.addChannel({
        src: 'fooProcess',
        dest: 'dest'
      })

      expect(procedure).not.to.be.called

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
          'val': runtimeTypes.PORT_TYPES.HOT
        },
        procedure
      })

      sys.addChannel({
        src: 'src1',
        dest: 'process',
        port: 'val'
      })

      sys.addChannel({
        src: 'process',
        dest: 'dest'
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
          'val': runtimeTypes.PORT_TYPES.ACCUMULATOR
        },
        procedure
      })

      sys.addChannel({
        src: 'process',
        dest: 'dest'
      })

      sys.set('dest', 1)

      expect(procedure).to.not.be.called

      sys.start('process')
      expect(sys.get('dest')).to.equal(2)
      sys.start('process')
      expect(sys.get('dest')).to.equal(3)
      sys.start('process')
      expect(sys.get('dest')).to.equal(4)
    })


    it('have processes that dont react on cold entity ports', function() {
      let procedure = sinon.spy((input, out) => {
        out(input.val1 + input.val2)
      })

      sys.addProcess({
        id: 'process',
        ports: {
          'val1': runtimeTypes.PORT_TYPES.HOT,
          'val2': runtimeTypes.PORT_TYPES.COLD
        },
        procedure
      })

      sys.addChannel({
        src: 'src2',
        dest: 'process',
        port: 'val2'
      })

      sys.addChannel({
        src: 'src1',
        dest: 'process',
        port: 'val1'
      })

      sys.addChannel({
        src: 'process',
        dest: 'dest'
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
  })

})
