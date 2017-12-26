export function deepmerge (obj1: any, obj2: any): any {
	if (
		typeof obj1 === 'object'
		&& typeof obj2 === 'object'
		&& !Array.isArray(obj1)
		&& !Array.isArray(obj2)
		&& obj1 !== obj2
	) {

		const result = { ...obj1 }

		for (const key in obj2) {
			const val1 = obj1[key]
			const val2 = obj2[key]

			if (typeof val2 !== 'undefined') {
				result[key] = deepmerge(val1, val2)
			} else {
				delete result[key]
			}
		}

		return result
	}

	return obj2
}
