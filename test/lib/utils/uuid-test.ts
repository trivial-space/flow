/// <reference path="../../test.d.ts" />
import {v4} from '../../../lib/utils/uuid'


describe('UUID', function() {

  it('generates random strings', function() {
    let u1 = v4(),
        u2 = v4(),
        u3 = v4(),
        u4 = v4()

    expect(u1).to.be.a('string')
    expect(u2).to.be.a('string')
    expect(u3).to.be.a('string')
    expect(u4).to.be.a('string')

    expect(u1).to.not.equal(u2)
    expect(u1).to.not.equal(u3)
    expect(u1).to.not.equal(u4)
    expect(u2).to.not.equal(u3)
    expect(u2).to.not.equal(u4)
    expect(u3).to.not.equal(u4)
  })
})
