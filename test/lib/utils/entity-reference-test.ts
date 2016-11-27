/// <reference path="../../test.d.ts" />
import {create, EntityFactory} from '../../../lib/utils/entity-reference'
import * as types from '../../../lib/runtime-types'
import * as runtime from '../../../lib/runtime'


describe('flow entity reference', function() {

  var sys: types.Runtime, entity: EntityFactory, addToFlow;

  beforeEach(function() {
    sys = runtime.create()
    const generator = create(sys)
    entity = generator.entity
    addToFlow = generator.addToFlow
  })


  it('can be added to the flow', function() {
    const e1 = entity()
    const e2 = entity()
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
    const e1 = entity()
    const e2 = entity()

    addToFlow({
      entity1: e1,
      entity2: e2
    }, 'foo.bar')

    expect(sys.getGraph().entities).to.deep.equal({
      "foo.bar.entity1": types.createEntity({id: "foo.bar.entity1"}),
      "foo.bar.entity2": types.createEntity({id: "foo.bar.entity2"})
    })
  })


  it('can set its id and attach to flow', function() {
    const e1 = entity(123)
    e1.id('e1')

    const e2 = entity(345)
    e2.id('e2')

    expect(sys.get('e1')).to.equal(123)
    expect(sys.get('e2')).to.equal(345)
  })


  it('can get its id', function() {
    const e = entity().id('foo')

    expect(e.getId()).to.equal('foo')
  })


  it('can be initialized with a value', function() {
    const e1 = entity("foo")
    const e2 = entity(1234)

    addToFlow({ e1, e2 })

    expect(sys.get('e1')).to.equal('foo')
    expect(sys.get('e2')).to.equal(1234)
  })


  it('can set its value explicitly', function() {
    const e1 = entity()
    e1
      .id('e1')
      .value(123)

    expect(sys.get('e1')).to.equal(123)
  })


  it('can set its json', function() {
    const e1 = entity()
    e1
      .id('e1')
      .json('123')

    expect(sys.get('e1')).to.equal(123)
    expect(sys.getGraph().entities['e1'].json).to.equal('123')
  })


  it('can set and unset its event property', function() {
    const e1 = entity()
      .id('e1')
      .isEvent()

    expect(sys.getGraph().entities['e1'].isEvent).to.be.true

    e1.isEvent(false)

    expect(sys.getGraph().entities['e1'].isEvent).to.be.false
  })


  it('can add a stream', function() {
    const p = () => 100
    entity()
      .id('e')
      .stream({ do: p })

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          procedure: p,
        })
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
    const p = (_, send) => send(100)
    entity()
      .id('e')
      .stream({
        id: 'createE',
        async: true,
        autostart: true,
        do: p })

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'})
      },
      processes: {
        createE: types.createProcess({
          id: "createE",
          procedure: p,
          async: true,
          autostart: true
        })
      },
      arcs: {
        'createE->e': types.createArc({
          process: "createE",
          entity: "e"
        })
      },
      meta: {}
    })
  })


  it('can add a stream depending on other entities', function() {
    const p = ({foo, bar, self}) => bar + foo + self
    const foo = entity(2)
      .id('foo')

    const bar = entity(3)
      .id('bar')

    entity(4)
      .id('e')
      .stream({
        with: {
          foo: foo.HOT,
          bar: bar.COLD,
          self: entity.SELF
        },
        do: p
      })

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e', value: 4}),
        foo: types.createEntity({id: 'foo', value: 2}),
        bar: types.createEntity({id: 'bar', value: 3})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          ports: {
            foo: sys.PORT_TYPES.HOT,
            bar: sys.PORT_TYPES.COLD,
            self: sys.PORT_TYPES.ACCUMULATOR
          },
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        }),
        'foo->eStream::foo': types.createArc({
          process: "eStream",
          entity: "foo",
          port: "foo"
        }),
        'bar->eStream::bar': types.createArc({
          process: "eStream",
          entity: "bar",
          port: "bar"
        })
      },
      meta: {}
    })

    sys.flush()

    expect(sys.get('e')).to.equal(9)
  })


  it('changes updates flow on changed id', function() {
    const p = ({foo}) => foo + 2
    const foo = entity(20)

    const e = entity()
      .stream({
        with: {
          foo: foo.HOT,
        },
        do: p
      })

    addToFlow({foo, e})

    expect(sys.getGraph()).to.deep.equal({
      entities: {
        e: types.createEntity({id: 'e'}),
        foo: types.createEntity({id: 'foo', value: 20})
      },
      processes: {
        eStream: types.createProcess({
          id: "eStream",
          ports: {foo: sys.PORT_TYPES.HOT},
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        }),
        'foo->eStream::foo': types.createArc({
          process: "eStream",
          entity: "foo",
          port: "foo"
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
          ports: {foo: sys.PORT_TYPES.HOT},
          procedure: p,
        })
      },
      arcs: {
        'eStream->e': types.createArc({
          process: "eStream",
          entity: "e"
        }),
        'bar->eStream::foo': types.createArc({
          process: "eStream",
          entity: "bar",
          port: "foo"
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
    const p = sinon.spy(({e}) => e + 1)

    const e = entity(12)

    const e2 = entity()
      .stream({
        with: {e: e.HOT},
        do: p
      })

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
