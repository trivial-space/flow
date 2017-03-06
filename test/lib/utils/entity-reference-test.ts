/// <reference path="../../test.d.ts" />
import {create, ValueFactory, JsonValueFactory, StreamFactory, AsyncStreamFactory} from 'utils/entity-reference'
import * as types from 'runtime-types'
import * as runtime from 'runtime'


describe('flow entity reference', function() {

  var sys: types.Runtime,
      val: ValueFactory,
      json: JsonValueFactory,
      stream: StreamFactory,
      asyncStream: AsyncStreamFactory,
      streamStart: StreamFactory,
      asyncStreamStart: AsyncStreamFactory,
      addToFlow

  beforeEach(function() {
    sys = runtime.create()
    const generator = create(sys)
    val = generator.val
    json = generator.json
    stream = generator.stream
    streamStart = generator.streamStart
    asyncStream = generator.asyncStream
    asyncStreamStart = generator.asyncStreamStart
    addToFlow = generator.addToFlow
  })


  it('can be added to the flow', function() {
    const e1 = val()
    const e2 = val()
    const id = sinon.stub()

    addToFlow({
      entity1: e1,
      entity2: e2,

      foo: 'foo',
      bar: 1234,
      bazz: {id}
    })

    expect(sys.getGraph().entities).to.deep.equal({
      entity1: types.createEntity({id: "entity1"}),
      entity2: types.createEntity({id: "entity2"})
    })

    expect(id).to.not.be.called
  })


  it('can be added to the flow with prefix', function() {
    const e1 = val()
    const e2 = val()

    addToFlow({
      entity1: e1,
      entity2: e2
    }, 'foo.bar')

    expect(sys.getGraph().entities).to.deep.equal({
      "foo.bar.entity1": types.createEntity({id: "foo.bar.entity1"}),
      "foo.bar.entity2": types.createEntity({id: "foo.bar.entity2"})
    })
  })


  it('can be added to the flow with prefix by id function', function() {
    val().id('entity1', 'foo.bar')
    val().id('entity2', 'foo.bar')

    expect(sys.getGraph().entities).to.deep.equal({
      "foo.bar.entity1": types.createEntity({id: "foo.bar.entity1"}),
      "foo.bar.entity2": types.createEntity({id: "foo.bar.entity2"})
    })
  })


  it('can get its id', function() {
    const e = val().id('foo')

    expect(e.getId()).to.equal('foo')
  })


  it('can be initialized with a value', function() {
    const e1 = val("foo")
    const e2 = val(1234)

    addToFlow({ e1, e2 })

    expect(sys.get('e1')).to.equal('foo')
    expect(sys.get('e2')).to.equal(1234)
  })


  it('can change their value', function() {
    const e1 = val("foo")
    const e2 = val(1234)

    e1.val('bar')
    e2.val(4567)

    addToFlow({ e1, e2 })

    expect(sys.get('e1')).to.equal('bar')
    expect(sys.get('e2')).to.equal(4567)
  })


  it('can set its json', function() {
    json('123').id('e1')

    expect(sys.get('e1')).to.equal(123)
  })


  it('can change its json', function() {
    json('123').json('234').id('e1')

    expect(sys.get('e1')).to.equal(234)
  })


  it('can add a stream', function() {
    const p = () => 100
    stream(p).id('e')

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          ports: [],
          procedure: p,
        }),
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        })
      },
      meta: {}
    })
  })


  it('can add a stream with all props', function() {
    const p1 = (send) => send(100)
    const p2 = () => 100
    asyncStreamStart('createE', p1).id('e')
    streamStart('createF', p2).id('f')
    asyncStream('createG', p1).id('g')

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'}),
        f: types.createEntity({id: 'f'}),
        g: types.createEntity({id: 'g'})
      },
      processes: {
        createE: types.createProcess({
          id: "createE",
          procedure: p1,
          async: true,
          autostart: true,
          ports: []
        }),
        createF: types.createProcess({
          id: "createF",
          procedure: p2,
          autostart: true,
          ports: []
        }),
        createG: types.createProcess({
          id: "createG",
          procedure: p1,
          async: true,
          ports: []
        }),
      },
      arcs: {
        'createE->e': types.createArc({
          process: "createE",
          entity: "e"
        }),
        'createF->f': types.createArc({
          process: "createF",
          entity: "f"
        }),
        'createG->g': types.createArc({
          process: "createG",
          entity: "g"
        })
      },
      meta: {}
    })
  })


  it('can add a stream depending on other entities', function() {
    const p = (self, foo, bar) => bar + foo + self

    const foo = val(2).id('foo')
    const bar = val(3).id('bar')

    val(4).id('e')
      .react([
        foo.HOT,
        bar.COLD,
      ], p )

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e', value: 4}),
        foo: types.createEntity({id: 'foo', value: 2}),
        bar: types.createEntity({id: 'bar', value: 3})
      },
      processes: {
        eReaction0: types.createProcess({
          id: "eReaction0",
          ports: [
            sys.PORT_TYPES.ACCUMULATOR,
            sys.PORT_TYPES.HOT,
            sys.PORT_TYPES.COLD
          ],
          procedure: p,
        })
      },
      arcs: {
        'eReaction0->e': types.createArc({
          process: "eReaction0",
          entity: "e"
        }),
        'foo->eReaction0::1': types.createArc({
          process: "eReaction0",
          entity: "foo",
          port: "1"
        }),
        'bar->eReaction0::2': types.createArc({
          process: "eReaction0",
          entity: "bar",
          port: "2"
        })
      },
      meta: {}
    })

    sys.flush()

    expect(sys.get('e')).to.equal(9)
  })


  it('changes updates flow on changed id', function() {
    const p = foo => foo + 2

    const foo = val(20)

    const e = stream([foo.HOT],p)

    addToFlow({foo, e})

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'}),
        foo: types.createEntity({id: 'foo', value: 20})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          ports: [sys.PORT_TYPES.HOT],
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        }),
        'foo->eStream::0': types.createArc({
          process: "eStream",
          entity: "foo",
          port: "0"
        })
      },
      meta: {}
    })

    sys.flush()

    expect(sys.get('e')).to.equal(22)

    foo.id('bar')

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'}),
        bar: types.createEntity({id: 'bar', value: 20})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          ports: [sys.PORT_TYPES.HOT] ,
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        }),
        'bar->eStream::0': types.createArc({
          process: "eStream",
          entity: "bar",
          port: "0"
        })
      },
      meta: {}
    })

    sys.set('bar', 3)
    expect(sys.get('e')).to.equal(5)

    sys.set('foo', 66)
    expect(sys.get('e')).to.equal(5)
  })


  it("only updates the flow entity if the id is different than the previous id", function() {
    const p = sinon.spy(e => e + 1)

    const e = val(12)

    const e2 = stream([e.HOT], p)

    addToFlow({e, e2})

    sys.flush()

    expect(p).to.be.called
    expect(sys.get('e2')).to.equal(13)

    p.reset()

    e.id('e')

    sys.flush()

    expect(p).not.to.be.called
  })

})
