import {evaluate} from '../../../src/utils/code-evaluator'


describe('Code evaluator', function() {

  it('evaluates a function', function() {
    const code = "function (a, b) {return a + b}"
    const result = evaluate(code) as Function

    expect(result).to.be.a('function')
    expect(result.toString()).to.equal(code)
    expect(result(2, 5)).to.equal(7)
  })


  it('evaluates an expression', function() {
    const code = "4 + 6"

    expect(evaluate(code)).to.equal(10)
  })


  it('provides access to an external context', function() {
    const context = {
      test: sinon.spy(function(a, b) {
        return a + b
      })
    }

    const code = "this.test(3, 4)"
    const result = evaluate(code, context)

    expect(result).to.equal(7)
    expect(context.test).to.be.calledWith(3, 4)
  })


  it('is neutral to this inside function', function() {
    const code = "function () {\n\treturn this.myCtxFunc()\n}"
    const func = evaluate(code) as Function

    expect(func.call({ myCtxFunc: function() { return 42 } }))
      .to.equal(42)
  })

})
