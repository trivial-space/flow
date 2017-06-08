import { Graph } from '../runtime-types'


export function empty (): Graph {
	return {
		entities: {},
		processes: {},
		arcs: {},
		meta: {}
	}
}


export function merge (g1: Graph, g2: Graph): Graph {
	return {
		entities: {
			...g1.entities,
			...g2.entities
		},
		processes: {
			...g1.processes,
			...g2.processes
		},
		arcs: {
			...g1.arcs,
			...g2.arcs
		},
		meta: {
			...g1.meta,
			...g2.meta
		}
	}
}
