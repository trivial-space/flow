import {
  resolveEntities,
  val,
  stream,
  asyncStreamStart,
  streamStart,
  asyncStream,
  getGraphFromEntities
} from 'utils/entity-reference'
import { createEntity, createProcess, createArc, PORT_TYPES } from "runtime-types";


describe('flow entity reference', function() {

  it('can be transformed to flow graph', function() {
    const e1 = val()
    const e2 = val()
    const id = sinon.stub()

    const graph = getGraphFromEntities(resolveEntities({
      entity1: e1,
      entity2: e2,

      foo: 'foo',
      bar: 1234,
      bazz: {id}
    }))

    expect(graph).to.deep.equal({
      entities: {
        entity1: createEntity({ id: "entity1" }),
        entity2: createEntity({ id: "entity2" })
      },
      processes: {},
      arcs: {},
      meta: {}
    })

    expect(id).to.not.be.called
  })


  it('can be added to the flow with prefix', function() {
    const e1 = val()
    const e2 = val()

    const graph = getGraphFromEntities(resolveEntities({
      entity1: e1,
      entity2: e2
    }, 'foo.bar'))

    expect(graph.entities).to.deep.equal({
      "foo.bar.entity1": createEntity({id: "foo.bar.entity1"}),
      "foo.bar.entity2": createEntity({id: "foo.bar.entity2"})
    })
  })


  it('can be added to the flow with prefix by id function', function() {
    const e1 = val().id('entity1', 'foo.bar')
    const e2 = val().id('entity2', 'foo.bar')

    expect(getGraphFromEntities([e1, e2]).entities).to.deep.equal({
      "foo.bar.entity1": createEntity({id: "foo.bar.entity1"}),
      "foo.bar.entity2": createEntity({id: "foo.bar.entity2"})
    })
  })


  it('can get its graph', function() {
    const e = val().id('foo')

    expect(e.getGraph()).to.deep.equal({
      entities: {
        foo: createEntity({id: 'foo'})
      },
      processes: {},
      arcs: {},
      meta: {}
    })
  })


  it('can be initialized with a value', function() {
    const e1 = val("foo")
    const e2 = val(1234)

    const g = getGraphFromEntities(resolveEntities({ e1, e2 }))

    expect(g.entities).to.deep.equal({
      e1: createEntity({id: "e1", value: 'foo'}),
      e2: createEntity({id: "e2", value: 1234})
    })
  })


  it('can change their value', function() {
    const e1 = val("foo")
    const e2 = val(1234)

    e1.val('bar')
    e2.val(4567)

    const g = getGraphFromEntities(resolveEntities({ e1, e2 }))

    expect(g.entities).to.deep.equal({
      e1: createEntity({id: "e1", value: 'bar'}),
      e2: createEntity({id: "e2", value: 4567})
    })
  })


  it('can add a stream', function() {
    const p = () => 100
    const s = stream(p).id('e')

    expect(s.getGraph()).to.deep.equal({
      entities: {
        e: createEntity({id: 'e'})
      },
      processes: {
        eStream: createProcess({
          id: "eStream",
          ports: [],
          procedure: p,
        }),
      },
      arcs: {
        'eStream->e': createArc({
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

    const s1 = asyncStreamStart('createE', p1).id('e')
    const s2 = streamStart('createF', p2).id('f')
    const s3 = asyncStream('createG', p1).id('g')

    expect(getGraphFromEntities([s1, s2, s3])).to.deep.equal({
      entities: {
        e: createEntity({id: 'e'}),
        f: createEntity({id: 'f'}),
        g: createEntity({id: 'g'})
      },
      processes: {
        createE: createProcess({
          id: "createE",
          procedure: p1,
          async: true,
          autostart: true
        }),
        createF: createProcess({
          id: "createF",
          procedure: p2,
          autostart: true
        }),
        createG: createProcess({
          id: "createG",
          procedure: p1,
          async: true
        }),
      },
      arcs: {
        'createE->e': createArc({
          process: "createE",
          entity: "e"
        }),
        'createF->f': createArc({
          process: "createF",
          entity: "f"
        }),
        'createG->g': createArc({
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

    const e = val(4).id('e')
      .react([
        foo.HOT,
        bar.COLD,
      ], p )

    expect(getGraphFromEntities([e, foo, bar])).to.deep.equal({
      entities: {
        e: createEntity({id: 'e', value: 4}),
        foo: createEntity({id: 'foo', value: 2}),
        bar: createEntity({id: 'bar', value: 3})
      },
      processes: {
        eReaction0: createProcess({
          id: "eReaction0",
          ports: [
            PORT_TYPES.ACCUMULATOR,
            PORT_TYPES.HOT,
            PORT_TYPES.COLD
          ],
          procedure: p,
        })
      },
      arcs: {
        'eReaction0->e': createArc({
          process: "eReaction0",
          entity: "e"
        }),
        'foo->eReaction0::1': createArc({
          process: "eReaction0",
          entity: "foo",
          port: "1"
        }),
        'bar->eReaction0::2': createArc({
          process: "eReaction0",
          entity: "bar",
          port: "2"
        })
      },
      meta: {}
    })
  })


  it('changes updates flow on changed id', function() {
    const p = foo => foo + 2

    const foo = val(20)

    const e = stream([foo.HOT],p)

    resolveEntities({foo, e})

    expect(getGraphFromEntities([foo, e])).to.deep.equal({
      entities: {
        e: createEntity({id: 'e'}),
        foo: createEntity({id: 'foo', value: 20})
      },
      processes: {
        eStream: createProcess({
          id: "eStream",
          ports: [PORT_TYPES.HOT],
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': createArc({
          process: "eStream",
          entity: "e"
        }),
        'foo->eStream::0': createArc({
          process: "eStream",
          entity: "foo",
          port: "0"
        })
      },
      meta: {}
    })


    foo.id('bar')

    expect(getGraphFromEntities([e, foo])).to.deep.equal({
      entities: {
        e: createEntity({id: 'e'}),
        bar: createEntity({id: 'bar', value: 20})
      },
      processes: {
        eStream: createProcess({
          id: "eStream",
          ports: [PORT_TYPES.HOT] ,
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': createArc({
          process: "eStream",
          entity: "e"
        }),
        'bar->eStream::0': createArc({
          process: "eStream",
          entity: "bar",
          port: "0"
        })
      },
      meta: {}
    })

  })


  it("only updates the flow entity if the id is different than the previous id", function() {
    const p = sinon.spy(e => e + 1)

    const e = val(12)

    const e2 = stream([e.HOT], p)

    resolveEntities({e, e2})

    sys.flush()

    expect(p).to.be.called
    expect(sys.get('e2')).to.equal(13)

    p.reset()

    e.id('e')

    sys.flush()

    expect(p).not.to.be.called
  })

})
