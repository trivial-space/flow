import * as entitySpec from 'utils/entity-spec'
import {expect} from 'chai'


describe('flow entitySpec', function () {

  describe('processProcessSpec', function() {

    const {processProcessSpec} = entitySpec


    it('from minimal process spec', function () {
      const p = () => 100
      const spec = {do: p}

      expect(processProcessSpec("e", spec)).to.deep.equal({
        entities: [],
        processes: [{
          id: "eStream",
          procedure: p,
        }],
        arcs: [{
          process: "eStream",
          entity: "e"
        }]
      })
    })


    it('can declare its own id', function() {
      const p = () => {}
      const spec = {
        id: 'fooo',
        do: p
      }

      expect(processProcessSpec("e", spec)).to.deep.equal({
        entities: [],
        processes: [{
          id: "fooo",
          procedure: p,
        }],
        arcs: [{
          process: "fooo",
          entity: "e"
        }]
      })
    })


    it('takes other valid process props', function () {
      const p = () => 100
      const spec = {
        do: p,
        autostart: true,
        async: true,
        meta: {foo: "foo"}
      }

      expect(processProcessSpec("e", spec)).to.deep.equal({
        entities: [],
        processes: [{
          id: "eStream",
          procedure: p,
          autostart: true,
          async: true,
          meta: {foo: "foo"}
        }],
        arcs: [{
          process: "eStream",
          entity: "e"
        }]
      })
    })


    it('from process spec with deps', function () {
      const p = ({e1, e2, e3}) => e1 + e2 + e3

      const spec = {
        with: {
          e1: "H entity1",
          e3: "C entity3",
          e2: "A"
        },
        do: p
      }

      expect(processProcessSpec("entity2", spec)).to.deep.equal({
        entities: [],
        processes: [{
          id: "entity2Stream",
          procedure: p,
          ports: {
            e1: "HOT",
            e2: "ACCUMULATOR",
            e3: "COLD"
          }
        }],
        arcs: [{
          process: "entity2Stream",
          entity: "entity2"
        }, {
          entity: "entity1",
          process: "entity2Stream",
          port: "e1"
        }, {
          entity: "entity3",
          process: "entity2Stream",
          port: "e3"
        }]
      })
    })


    it('can have lower case port types', function () {
      const p = ({e1, e2, e3}) => e1 + e2 + e3

      const spec = {
        with: {
          e1: "h entity1",
          e3: "c entity3",
          e2: "a"
        },
        do: p
      }

      expect(processProcessSpec("entity2", spec).processes[0]).to.deep.equal({
        id: "entity2Stream",
        procedure: p,
        ports: {
          e1: "HOT",
          e2: "ACCUMULATOR",
          e3: "COLD"
        }
      })
    })


    it('takes an optional path parameter and resolves entities within the path', function () {

      const p = ({e2, e3}) => e2 + e3

      const spec1 = {
        with: {
          e2: "H .entity2",
        },
        do: p
      }

      const spec2 = {
        with: {
          e2: "H ..entity2",
        },
        do: p
      }

      const spec3 = {
        with: {
          e2: "H ...entity2",
        },
        do: p
      }

      const spec4 = {
        with: {
          e2: "H ....entity2",
        },
        do: p
      }

      expect(processProcessSpec("entity1", spec1, "some.namespace")).to.deep.equal({
        entities: [],
        processes: [{
          id: "some.namespace.entity1Stream",
          procedure: p,
          ports: {
            e2: "HOT"
          }
        }],
        arcs: [{
          process: "some.namespace.entity1Stream",
          entity: "some.namespace.entity1"
        }, {
          entity: "some.namespace.entity2",
          process: "some.namespace.entity1Stream",
          port: "e2"
        }]
      })

      expect(processProcessSpec("entity1", spec2, "some.namespace")).to.deep.equal({
        entities: [],
        processes: [{
          id: "some.namespace.entity1Stream",
          procedure: p,
          ports: {
            e2: "HOT"
          }
        }],
        arcs: [{
          process: "some.namespace.entity1Stream",
          entity: "some.namespace.entity1"
        }, {
          entity: "some.entity2",
          process: "some.namespace.entity1Stream",
          port: "e2"
        }]
      })

      expect(processProcessSpec("entity1", spec3, "some.namespace")).to.deep.equal({
        entities: [],
        processes: [{
          id: "some.namespace.entity1Stream",
          procedure: p,
          ports: {
            e2: "HOT"
          }
        }],
        arcs: [{
          process: "some.namespace.entity1Stream",
          entity: "some.namespace.entity1"
        }, {
          entity: "entity2",
          process: "some.namespace.entity1Stream",
          port: "e2"
        }]
      })

      expect(processProcessSpec("entity1", spec4, "some.namespace")).to.deep.equal(
        processProcessSpec("entity1", spec3, "some.namespace")
      )
    })


    it('removes hash when no path is given', function() {
      const p = () => {}

      const spec = {
        with: {
          e1: "C .entity1",
        },
        do: p
      }

      expect(processProcessSpec("e2", spec)).to.deep.equal({
        entities: [],
        processes: [{
          id: "e2Stream",
          procedure: p,
          ports: {
            e1: "COLD"
          }
        }],
        arcs: [{
          process: "e2Stream",
          entity: "e2"
        }, {
          entity: "entity1",
          process: "e2Stream",
          port: "e1"
        }]
      })
    })
  })


  describe('processEntitySpec', function() {

    const {processEntitySpec} = entitySpec


    it('from entity spec with value', function () {

      const spec = { val: 10 }

      expect(processEntitySpec("e1", spec)).to.deep.equal({
        entities: [{
          id: "e1",
          value: 10
        }],
        processes: [],
        arcs: []
      })
    })


    it('from entity spec with falsy value', function () {

      const spec = { val: 0 }
      const spec2 = { val: false }

      expect(processEntitySpec("e1", spec)).to.deep.equal({
        entities: [{
          id: "e1",
          value: 0
        }],
        processes: [],
        arcs: []
      })

      expect(processEntitySpec("e2", spec2)).to.deep.equal({
        entities: [{
          id: "e2",
          value: false
        }],
        processes: [],
        arcs: []
      })
    })


    it('takes an optional path parameter', function () {

      const spec = { val: 10 }

      expect(processEntitySpec("e1", spec, "fuu.bar")).to.deep.equal({
        entities: [{
          id: "fuu.bar.e1",
          value: 10
        }],
        processes: [],
        arcs: []
      })
    })


    it('from entity spec with other entity props', function () {

      const spec = { json: "10", isEvent: true, meta: {fufu: "fuuu"} }

      expect(processEntitySpec("e1", spec)).to.deep.equal({
        entities: [{
          id: "e1",
          json: "10",
          isEvent: true,
          meta: {fufu: "fuuu"}
        }],
        processes: [],
        arcs: []
      })
    })


    it('from entity spec with basic stream', function () {
      const p = ({e1}) => e1 + 20

      const spec = {
        stream: {
          with: {
            e1: "H entity1"
          },
          do: p
        }
      }

      expect(processEntitySpec("entity2", spec)).to.deep.equal({
        entities: [{
          id: "entity2",
        }],
        processes: [{
          id: "entity2Stream",
          procedure: p,
          ports: {e1: "HOT"}
        }],
        arcs: [{
          process: "entity2Stream",
          entity: "entity2"
        }, {
          entity: "entity1",
          process: "entity2Stream",
          port: "e1"
        }]
      })
    })


    it('from entity with multiple streams', function() {
      const p1 = () => {}
      const p2 = () => {}

      const spec = {
        streams: [{
          do: p1
        }, {
          do: p2,
          with: {
            e1: "H entity1",
            e2: "A"
          }
        }]
      }

      expect(processEntitySpec("entity2", spec)).to.eql({
        entities: [{
          id: "entity2",
        }],
        processes: [{
          id: "entity2Stream1",
          procedure: p1
        }, {
          id: "entity2Stream2",
          procedure: p2,
          ports: {e1: "HOT", e2: "ACCUMULATOR"}
        }],
        arcs: [{
          process: "entity2Stream1",
          entity: "entity2"
        }, {
          process: "entity2Stream2",
          entity: "entity2"
        }, {
          entity: "entity1",
          process: "entity2Stream2",
          port: "e1"
        }]
      })
    })
  })


  describe('toGraph', function() {

    const {toGraph} = entitySpec


    it('from entity spec with value', function () {

      const spec = {
        entity1: { val: 10 },
      }

      expect(toGraph(spec)).to.deep.equal({
        entities: [{
          id: "entity1",
          value: 10
        }],
        processes: [],
        arcs: []
      })
    })


    it('from entity spec with basic stream', function () {
      const p = ({e1}) => e1 + 20

      const spec = {
        entity2: {
          stream: {
            with: {
              e1: "H entity1"
            },
            do: p
          }
        }
      }

      expect(toGraph(spec)).to.deep.equal({
        entities: [{
          id: "entity2",
        }],
        processes: [{
          id: "entity2Stream",
          procedure: p,
          ports: {e1: "HOT"}
        }],
        arcs: [{
          process: "entity2Stream",
          entity: "entity2"
        }, {
          entity: "entity1",
          process: "entity2Stream",
          port: "e1"
        }]
      })
    })


    it('take an optional path parameter', function () {
      const p = ({e1}) => e1 + 20

      const spec = {
        entity2: {
          stream: {
            with: {
              e1: "H .entity1"
            },
            do: p
          }
        }
      }

      expect(toGraph(spec, 'path')).to.deep.equal({
        entities: [{
          id: "path.entity2",
        }],
        processes: [{
          id: "path.entity2Stream",
          procedure: p,
          ports: {e1: "HOT"}
        }],
        arcs: [{
          process: "path.entity2Stream",
          entity: "path.entity2"
        }, {
          entity: "path.entity1",
          process: "path.entity2Stream",
          port: "e1"
        }]
      })

    })
  })
})
