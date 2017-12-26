import { deepmerge } from 'utils/helpers'


describe('helper utils', function() {

	describe('deepmerge', function() {

		it('deepmerges two objects', function() {
			const obj1 = {
				lala: 2,
				foo: {
					kuku: 3,
					bar: {
						kuku: 1
					}
				}
			}

			const obj2 = {
				foo: {
					kuku: 4,
					bar: {
						lulu: 3
					}
				}
			}

			const result = deepmerge(obj1, obj2)

			expect(result).to.deep.equal({
				lala: 2,
				foo: {
					kuku: 4,
					bar: {
						kuku: 1,
						lulu: 3
					}
				}
			})

			expect(result).to.not.equal(obj1)
			expect(result).to.not.equal(obj2)
		})

		it('doesnt merge arrays', function() {
			const obj1 = { arr: { foo: 'bar' } }
			const obj2 = { arr: [1, 4, 5, 6] }

			const result1 = deepmerge(obj1, obj2)
			const result2 = deepmerge(obj2, obj1)

			expect(result1).to.deep.equal({
				arr: [1, 4, 5, 6]
			})
			expect(result1.arr).to.equal(obj2.arr)

			expect(result2).to.deep.equal({
				arr: { foo: 'bar' }
			})
			expect(result2.arr).to.equal(obj1.arr)
		})


		it('returns second arg if args are not objects', function() {
			const obj = { fuu: 'bar' }
			const arr = [1, 2, 3]
			const val = 'baz'

			expect(deepmerge(obj, arr)).to.equal(arr)
			expect(deepmerge(obj, val)).to.equal(val)
			expect(deepmerge(arr, obj)).to.equal(obj)
			expect(deepmerge(val, obj)).to.equal(obj)
		})


		it('removes a property when assigned to undefined', function() {
			const obj = { foo: 'bar', kuku: 'kaka' }

			expect(deepmerge(obj, { kuku: undefined })).to.deep.equal({
				foo: 'bar'
			})
		})


		it('doesnt merge equal objects', function() {
			const nested = { foo: 'bar' }
			const o1 = { kuu: 1, nested }
			const o2 = { kuu: 5, nested }

			const o = deepmerge(o1, o2)
			expect(o.nested).to.equal(nested)
		})
	})

})
