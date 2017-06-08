import { PortType } from '../runtime-types'


// Doesn't work because of function union type

export interface EntityRef<T> {
	id: (_id: string, _ns?: string) => EntityRef<T>
	val: (value: T) => EntityRef<T>
	json: (json: string) => EntityRef<T>
	react: ReactionFactory<T>
	HOT: PortSpec<T>
	COLD: PortSpec<T>
	getId: () => string | undefined
	onId: (cb: (s: string) => void) => void
}


export interface PortSpec<T> {
	type: PortType,
	entity: EntityRef<T>
}


export type PortSpecs1<A> = [PortSpec<A>]
export type PortSpecs2<A, B> = [PortSpec<A>, PortSpec<B>]
export type PortSpecs3<A, B, C> = [PortSpec<A>, PortSpec<B>, PortSpec<C>]
export type PortSpecs4<A, B, C, D> = [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>]
export type PortSpecs5<A, B, C, D, E> = [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>]
export type PortSpecs6<A, B, C, D, E, F> = [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>]
export type PortSpecs7<A, B, C, D, E, F, G> = [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>, PortSpec<G>]
export type PortSpecs8<A, B, C, D, E, F, G, H> = [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>, PortSpec<G>, PortSpec<H>]



export type ProcedureSync0<T> = () => T | void

export type ProcedureSync1<T, A> = (
	arg1?: A
) => T | void

export type ProcedureSync2<T, A, B> = (
	arg1?: A,
	arg2?: B
) => T | void

export type ProcedureSync3<T, A, B, C> = (
	arg1?: A,
	arg2?: B,
	arg3?: C
) => T | void

export type ProcedureSync4<T, A, B, C, D> = (
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D
) => T | void

export type ProcedureSync5<T, A, B, C, D, E> = (
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E
) => T | void

export type ProcedureSync6<T, A, B, C, D, E, F> = (
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F
) => T | void

export type ProcedureSync7<T, A, B, C, D, E, F, G> = (
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G
) => T | void

export type ProcedureSync8<T, A, B, C, D, E, F, G, H> = (
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G,
	arg8?: H
) => T | void



export type ProcedureReact1<T, A> = (
	self: T,
	arg1?: A
) => T | void

export type ProcedureReact2<T, A, B> = (
	self: T,
	arg1?: A,
	arg2?: B
) => T | void

export type ProcedureReact3<T, A, B, C> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C
) => T | void

export type ProcedureReact4<T, A, B, C, D> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D
) => T | void

export type ProcedureReact5<T, A, B, C, D, E> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E
) => T | void

export type ProcedureReact6<T, A, B, C, D, E, F> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F
) => T | void

export type ProcedureReact7<T, A, B, C, D, E, F, G> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G
) => T | void

export type ProcedureReact8<T, A, B, C, D, E, F, G, H> = (
	self: T,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G,
	arg8?: H
) => T | void



export type ProcedureAsync0<T> = (
	send: (val?: T) => void
) => (() => void) | void

export type ProcedureAsync1<T, A> = (
	send: (val?: T) => void,
	arg1?: A
) => (() => void) | void

export type ProcedureAsync2<T, A, B> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B
) => (() => void) | void

export type ProcedureAsync3<T, A, B, C> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C
) => (() => void) | void

export type ProcedureAsync4<T, A, B, C, D> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D
) => (() => void) | void

export type ProcedureAsync5<T, A, B, C, D, E> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E
) => (() => void) | void

export type ProcedureAsync6<T, A, B, C, D, E, F> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F
) => (() => void) | void

export type ProcedureAsync7<T, A, B, C, D, E, F, G> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G
) => (() => void) | void

export type ProcedureAsync8<T, A, B, C, D, E, F, G, H> = (
	send: (val?: T) => void,
	arg1?: A,
	arg2?: B,
	arg3?: C,
	arg4?: D,
	arg5?: E,
	arg6?: F,
	arg7?: G,
	arg8?: H
) => (() => void) | void



export type ReactionFactory1<T> = <A>(
	a1: string | ProcedureReact1<T, A> | PortSpecs1<A>,
	a2?: PortSpec<any>[] | ProcedureReact1<T, A>,
	a3?: ProcedureReact1<T, A>
) => EntityRef<T>

export type ReactionFactory2<T> = <A, B>(
	a1: string | ProcedureReact2<T, A, B> | PortSpecs2<A, B>,
	a2?: PortSpec<any>[] | ProcedureReact2<T, A, B>,
	a3?: ProcedureReact2<T, A, B>
) => EntityRef<T>

export type ReactionFactory3<T> = <A, B, C>(
	a1: string | ProcedureReact3<T, A, B, C> | PortSpecs3<A, B, C>,
	a2?: PortSpec<any>[] | ProcedureReact3<T, A, B, C>,
	a3?: ProcedureReact3<T, A, B, C>
) => EntityRef<T>

export type ReactionFactory4<T> = <A, B, C, D>(
	a1: string | ProcedureReact4<T, A, B, C, D> | PortSpecs4<A, B, C, D>,
	a2?: PortSpec<any>[] | ProcedureReact4<T, A, B, C, D>,
	a3?: ProcedureReact4<T, A, B, C, D>
) => EntityRef<T>

export type ReactionFactory5<T> = <A, B, C, D, E>(
	a1: string | ProcedureReact5<T, A, B, C, D, E> | PortSpecs5<A, B, C, D, E>,
	a2?: PortSpec<any>[] | ProcedureReact5<T, A, B, C, D, E>,
	a3?: ProcedureReact5<T, A, B, C, D, E>
) => EntityRef<T>

export type ReactionFactory6<T> = <A, B, C, D, E, F>(
	a1: string | ProcedureReact6<T, A, B, C, D, E, F> | PortSpecs6<A, B, C, D, E, F>,
	a2?: PortSpec<any>[] | ProcedureReact6<T, A, B, C, D, E, F>,
	a3?: ProcedureReact6<T, A, B, C, D, E, F>
) => EntityRef<T>

export type ReactionFactory7<T> = <A, B, C, D, E, F, G>(
	a1: string | ProcedureReact7<T, A, B, C, D, E, F, G> | PortSpecs7<A, B, C, D, E, F, G>,
	a2?: PortSpec<any>[] | ProcedureReact7<T, A, B, C, D, E, F, G>,
	a3?: ProcedureReact7<T, A, B, C, D, E, F, G>
) => EntityRef<T>

export type ReactionFactory8<T> = <A, B, C, D, E, F, G, H>(
	a1: string | ProcedureReact8<T, A, B, C, D, E, F, G, H> | PortSpecs8<A, B, C, D, E, F, G, H>,
	a2?: PortSpec<any>[] | ProcedureReact8<T, A, B, C, D, E, F, G, H>,
	a3?: ProcedureReact8<T, A, B, C, D, E, F, G, H>
) => EntityRef<T>


export type ReactionFactory<T> =
	ReactionFactory1<T> |
	ReactionFactory2<T> |
	ReactionFactory3<T> |
	ReactionFactory4<T> |
	ReactionFactory5<T> |
	ReactionFactory6<T> |
	ReactionFactory7<T> |
	ReactionFactory8<T>


export type StreamFactory0 = <T>(
	a1: string | ProcedureSync0<T>,
	a2?: ProcedureSync0<T>
) => EntityRef<T>

export type StreamFactory1 = <T, A>(
	a1: string | ProcedureSync1<T, A> | PortSpecs1<A>,
	a2?: PortSpecs1<A> | ProcedureSync1<T, A>,
	a3?: ProcedureSync1<T, A>
) => EntityRef<T>

export type StreamFactory2 = <T, A, B>(
	a1: string | ProcedureSync2<T, A, B> | PortSpecs2<A, B>,
	a2?: PortSpecs2<A, B> | ProcedureSync2<T, A, B>,
	a3?: ProcedureSync2<T, A, B>
) => EntityRef<T>

export type StreamFactory3 = <T, A, B, C>(
	a1: string | ProcedureSync3<T, A, B, C> | PortSpecs3<A, B, C>,
	a2?: PortSpecs3<A, B, C> | ProcedureSync3<T, A, B, C>,
	a3?: ProcedureSync3<T, A, B, C>
) => EntityRef<T>

export type StreamFactory4 = <T, A, B, C, D>(
	a1: string | ProcedureSync4<T, A, B, C, D> | PortSpecs4<A, B, C, D>,
	a2?: PortSpecs4<A, B, C, D> | ProcedureSync4<T, A, B, C, D>,
	a3?: ProcedureSync4<T, A, B, C, D>
) => EntityRef<T>

export type StreamFactory5 = <T, A, B, C, D, E>(
	a1: string | ProcedureSync5<T, A, B, C, D, E> | PortSpecs5<A, B, C, D, E>,
	a2?: PortSpecs5<A, B, C, D, E> | ProcedureSync5<T, A, B, C, D, E>,
	a3?: ProcedureSync5<T, A, B, C, D, E>
) => EntityRef<T>

export type StreamFactory6 = <T, A, B, C, D, E, F>(
	a1: string | ProcedureSync6<T, A, B, C, D, E, F> | PortSpecs6<A, B, C, D, E, F>,
	a2?: PortSpecs6<A, B, C, D, E, F> | ProcedureSync6<T, A, B, C, D, E, F>,
	a3?: ProcedureSync6<T, A, B, C, D, E, F>
) => EntityRef<T>

export type StreamFactory7 = <T, A, B, C, D, E, F, G>(
	a1: string | ProcedureSync7<T, A, B, C, D, E, F, G> | PortSpecs7<A, B, C, D, E, F, G>,
	a2?: PortSpecs7<A, B, C, D, E, F, G> | ProcedureSync7<T, A, B, C, D, E, F, G>,
	a3?: ProcedureSync7<T, A, B, C, D, E, F, G>
) => EntityRef<T>

export type StreamFactory8 = <T, A, B, C, D, E, F, G, H>(
	a1: string | ProcedureSync8<T, A, B, C, D, E, F, G, H> | PortSpecs8<A, B, C, D, E, F, G, H>,
	a2?: PortSpecs8<A, B, C, D, E, F, G, H> | ProcedureSync8<T, A, B, C, D, E, F, G, H>,
	a3?: ProcedureSync8<T, A, B, C, D, E, F, G, H>
) => EntityRef<T>

export type StreamFactory =
	StreamFactory0 |
	StreamFactory1 |
	StreamFactory2 |
	StreamFactory3 |
	StreamFactory4 |
	StreamFactory5 |
	StreamFactory6 |
	StreamFactory7 |
	StreamFactory8



export type AsyncStreamFactory0 = <T>(
	a1: string | ProcedureAsync0<T>,
	a2?: ProcedureAsync0<T>
) => EntityRef<T>

export type AsyncStreamFactory1 = <T, A>(
	a1: string | ProcedureAsync1<T, A> | PortSpecs1<A>,
	a2?: PortSpecs1<A> | ProcedureAsync1<T, A>,
	a3?: ProcedureAsync1<T, A>
) => EntityRef<T>

export type AsyncStreamFactory2 = <T, A, B>(
	a1: string | ProcedureAsync2<T, A, B> | PortSpecs2<A, B>,
	a2?: PortSpecs2<A, B> | ProcedureAsync2<T, A, B>,
	a3?: ProcedureAsync2<T, A, B>
) => EntityRef<T>

export type AsyncStreamFactory3 = <T, A, B, C>(
	a1: string | ProcedureAsync3<T, A, B, C> | PortSpecs3<A, B, C>,
	a2?: PortSpecs3<A, B, C> | ProcedureAsync3<T, A, B, C>,
	a3?: ProcedureAsync3<T, A, B, C>
) => EntityRef<T>

export type AsyncStreamFactory4 = <T, A, B, C, D>(
	a1: string | ProcedureAsync4<T, A, B, C, D> | PortSpecs4<A, B, C, D>,
	a2?: PortSpecs4<A, B, C, D> | ProcedureAsync4<T, A, B, C, D>,
	a3?: ProcedureAsync4<T, A, B, C, D>
) => EntityRef<T>

export type AsyncStreamFactory5 = <T, A, B, C, D, E>(
	a1: string | ProcedureAsync5<T, A, B, C, D, E> | PortSpecs5<A, B, C, D, E>,
	a2?: PortSpecs5<A, B, C, D, E> | ProcedureAsync5<T, A, B, C, D, E>,
	a3?: ProcedureAsync5<T, A, B, C, D, E>
) => EntityRef<T>

export type AsyncStreamFactory6 = <T, A, B, C, D, E, F>(
	a1: string | ProcedureAsync6<T, A, B, C, D, E, F> | PortSpecs6<A, B, C, D, E, F>,
	a2?: PortSpecs6<A, B, C, D, E, F> | ProcedureAsync6<T, A, B, C, D, E, F>,
	a3?: ProcedureAsync6<T, A, B, C, D, E, F>
) => EntityRef<T>

export type AsyncStreamFactory7 = <T, A, B, C, D, E, F, G>(
	a1: string | ProcedureAsync7<T, A, B, C, D, E, F, G> | PortSpecs7<A, B, C, D, E, F, G>,
	a2?: PortSpecs7<A, B, C, D, E, F, G> | ProcedureAsync7<T, A, B, C, D, E, F, G>,
	a3?: ProcedureAsync7<T, A, B, C, D, E, F, G>
) => EntityRef<T>

export type AsyncStreamFactory8 = <T, A, B, C, D, E, F, G, H>(
	a1: string | ProcedureAsync8<T, A, B, C, D, E, F, G, H> | PortSpecs8<A, B, C, D, E, F, G, H>,
	a2?: PortSpecs8<A, B, C, D, E, F, G, H> | ProcedureAsync8<T, A, B, C, D, E, F, G, H>,
	a3?: ProcedureAsync8<T, A, B, C, D, E, F, G, H>
) => EntityRef<T>

export type AsyncStreamFactory =
	AsyncStreamFactory0 |
	AsyncStreamFactory1 |
	AsyncStreamFactory2 |
	AsyncStreamFactory3 |
	AsyncStreamFactory4 |
	AsyncStreamFactory5 |
	AsyncStreamFactory6 |
	AsyncStreamFactory7 |
	AsyncStreamFactory8
