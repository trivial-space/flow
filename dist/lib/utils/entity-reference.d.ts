import { PortType, Graph, AcceptPredicate } from '../runtime-types';
export interface PortSpec<T> {
    type: PortType;
    entity: EntityRef<T>;
}
export declare type ProcedureSync<T> = (...args: any[]) => T | void;
export declare type ProcedureReact<T> = (self: T, ...args: any[]) => T | void;
export declare type ProcedureAsync<T> = (send: (val?: T) => void, ...args: any[]) => (() => void) | void;
export declare type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>;
export interface StreamFactory {
    <T>(deps: null, p: () => T, id?: string): EntityRef<T>;
    <T, A>(deps: [PortSpec<A>], p: (a: A) => T, id?: string): EntityRef<T>;
    <T, A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (a: A, b: B) => T, id?: string): EntityRef<T>;
    <T, A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (a: A, b: B, c: C) => T, id?: string): EntityRef<T>;
    <T, A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (a: A, b: B, c: C, d: D) => T, id?: string): EntityRef<T>;
    <T, A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (a: A, b: B, c: C, d: D, e: E) => T, id?: string): EntityRef<T>;
    <T, A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (a: A, b: B, c: C, d: D, e: E, f: F) => T, id?: string): EntityRef<T>;
}
export interface AsyncStreamFactory {
    <T>(deps: null, p: (send: (val?: T) => void) => (() => void | void), id?: string): EntityRef<T>;
    <T, A>(deps: [PortSpec<A>], p: (send: (val?: T) => void, a: A) => (() => void | void), id?: string): EntityRef<T>;
    <T, A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (send: (val?: T) => void, a: A, b: B) => (() => void | void), id?: string): EntityRef<T>;
    <T, A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (send: (val?: T) => void, a: A, b: B, c: C) => (() => void | void), id?: string): EntityRef<T>;
    <T, A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D) => (() => void | void), id?: string): EntityRef<T>;
    <T, A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D, e: E) => (() => void | void), id?: string): EntityRef<T>;
    <T, A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (send: (val?: T) => void, a: A, b: B, c: C, d: D, e: E, f: F) => (() => void | void), id?: string): EntityRef<T>;
}
export interface ReactionFactory<T> {
    <A>(deps: [PortSpec<A>], p: (self: T, a: A) => T, id?: string): EntityRef<T>;
    <A, B>(deps: [PortSpec<A>, PortSpec<B>], p: (self: T, a: A, b: B) => T, id?: string): EntityRef<T>;
    <A, B, C>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>], p: (self: T, a: A, b: B, c: C) => T, id?: string): EntityRef<T>;
    <A, B, C, D>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>], p: (self: T, a: A, b: B, c: C, d: D) => T, id?: string): EntityRef<T>;
    <A, B, C, D, E>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>], p: (self: T, a: A, b: B, c: C, d: D, e: E) => T, id?: string): EntityRef<T>;
    <A, B, C, D, E, F>(deps: [PortSpec<A>, PortSpec<B>, PortSpec<C>, PortSpec<D>, PortSpec<E>, PortSpec<F>], p: (self: T, a: A, b: B, c: C, d: D, e: E, f: F) => T, id?: string): EntityRef<T>;
}
export interface EntityRef<T> {
    id: (_id: string, _ns?: string) => EntityRef<T>;
    getId: () => string;
    val: (value: T) => EntityRef<T>;
    accept: (a: AcceptPredicate<T>) => EntityRef<T>;
    react: ReactionFactory<T>;
    HOT: PortSpec<T>;
    COLD: PortSpec<T>;
    getGraph: () => Graph;
}
export interface EntitySpec<T> {
    id?: string;
    value?: T;
    processId?: string;
    pidSuffix?: string;
    procedure?: Procedure<T>;
    dependencies?: PortSpec<any>[];
    async?: boolean;
    autostart?: boolean;
}
export declare function val<T>(value?: T): EntityRef<T>;
export declare const stream: StreamFactory;
export declare const asyncStream: AsyncStreamFactory;
export declare const streamStart: StreamFactory;
export declare const asyncStreamStart: AsyncStreamFactory;
export declare function isEntity<T>(e: any): e is EntityRef<T>;
export declare function resolveEntityIds(entities: {
    [id: string]: any;
}, path?: string): any;
export declare function getGraphFromAll(entities: Object): Graph;
