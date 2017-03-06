import { merge, empty } from 'utils/graph-utils'
import { Graph, createEntity, createProcess, createArc } from "runtime-types";


describe('Graph utils', function() {

  describe('empty', function() {

    it('creates an empty graph', function() {
      const g: Graph = empty()

    expect(g).to.deep.equal({
        entities: {},
        processes: {},
        arcs: {},
        meta: {}
      })
    })
  })

  describe('merge', function() {

    it('merges two graphs', function() {

      const p = () => 20

      const graph1: Graph = {
        entities: {
          foo: createEntity({id: 'foo'}),
          bar: createEntity({id: 'bar'})
        },
        processes: {
          p: createProcess({id: 'p', procedure: p})
        },
        arcs: {
          kuu: createArc({
            id: 'kuu',
            process: 'p',
            entity: 'foo'
          })
        }
      }
      const graph2: Graph = {
        entities: {
          faz: createEntity({id: 'faz'}),
          baz: createEntity({id: 'baz'})
        },
        processes: {},
        arcs: {}
      }

      const graph: Graph = merge(graph1, graph2)

      console.log(graph)

      expect(graph).to.deep.equal({
        entities: {
          foo: createEntity({id: 'foo'}),
          bar: createEntity({id: 'bar'}),
          faz: createEntity({id: 'faz'}),
          baz: createEntity({id: 'baz'})
        },
        processes: {
          p: createProcess({id: 'p', procedure: p})
        },
        arcs: {
          kuu: createArc({
            id: 'kuu',
            process: 'p',
            entity: 'foo'
          })
        },
        meta: {}
      })
    })
  })

})
