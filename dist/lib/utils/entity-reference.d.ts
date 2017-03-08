import { PortType, Graph, AcceptPredicate } from '../runtime-types';
export interface PortSpec<T> {
    type: PortType;
    entity: EntityRef<T>;
}
export declare type ProcedureSync<T> = (...args: any[]) => T | void;
export declare type ProcedureReact<T> = (self: T, ...args: any[]) => T | void;
export declare type ProcedureAsync<T> = (send: (val?: T) => void, ...args: any[]) => (() => void) | void;
export declare type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>;
export declare type ReactionFactory<T> = (a1: string | PortSpec<any>[] | ProcedureReact<T>, a2?: PortSpec<any>[] | ProcedureReact<T>, a3?: ProcedureReact<T>) => EntityRef<T>;
export interface EntityRef<T> {
    id: (_id: string, _ns?: string) => EntityRef<T>;
    getId: () => string;
    val: (value: T) => EntityRef<T>;
    accept: (a: AcceptPredicate) => EntityRef<T>;
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
export declare function stream<T>(a1: string | PortSpec<any>[] | ProcedureSync<T>, a2?: PortSpec<any>[] | ProcedureSync<T>, a3?: ProcedureSync<T>): EntityRef<T>;
export declare function asyncStream<T>(a1: string | PortSpec<any>[] | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureAsync<T>, a3?: ProcedureAsync<T>): EntityRef<T>;
export declare function streamStart<T>(a1: string | PortSpec<any>[] | ProcedureSync<T>, a2?: PortSpec<any>[] | ProcedureSync<T>, a3?: ProcedureSync<T>): EntityRef<T>;
export declare function asyncStreamStart<T>(a1: string | PortSpec<any>[] | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureAsync<T>, a3?: ProcedureAsync<T>): EntityRef<T>;
export declare function isEntity<T>(e: any): e is EntityRef<T>;
export declare function resolveEntityIds(entities: {
    [id: string]: any;
}, path?: string): any;
export declare function getGraphFromAll(entities: Object): Graph;
