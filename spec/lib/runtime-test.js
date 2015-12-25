import runtime from 'runtime'


describe('Flow runtime', function() {

  var sys;

  beforeEach(function() {
    sys = runtime.create()
  })


  it('can get and set entities', function() {
    expect(sys.get('fufu')).be.undefined
    sys.set('fufu', 6)
    expect(sys.get('fufu')).to.equal(6)
  })


  it('updates by function', function() {
    sys.set('foo', 10)

    sys.update('foo', function(x) {
      return x + 3
    })

    expect(sys.get('foo')).to.equal(13)
  })


  it('can explicitly add entities with an initial Value', function() {
    sys.addEntity({
      id: 'foo',
      value: 22
    })

    expect(sys.get('foo')).to.equal(22)
  })


  it('can add procedures and connections that produce values', function () {
    let procedure = sinon.spy(function(input, out) { out('fooValue') })

    sys.addProcess({
      id: 'fooProcess',
      procedure
    })

    expect(procedure).not.to.be.called

    sys.addEntity({id: 'fooTarget'})

    expect(procedure).not.to.be.called

    sys.addChannel({
      src: 'fooProcess',
      dest: 'fooTarget'
    })

    expect(procedure).not.to.be.called

    sys.start('fooProcess')

    expect(procedure).to.be.called
    expect(sys.get('fooTarget')).to.equal('fooValue')
  })

})
