import { PortType, Runtime } from '../runtime-types';
export interface PortSpec<T> {
    type: PortType;
    entity: EntityRef<T>;
}
export declare type ProcedureSync<T> = (...args: any[]) => T | void;
export declare type ProcedureReact<T> = (self?: T, ...args: any[]) => T | void;
export declare type ProcedureAsync<T> = (send: (val?: T) => void, ...args: any[]) => (() => void) | void;
export declare type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>;
export declare type ReactionFactory<T> = (a1: string | PortSpec<any>[] | ProcedureReact<T>, a2?: PortSpec<any>[] | ProcedureReact<T>, a3?: ProcedureReact<T>) => EntityRef<T>;
export declare type StreamFactory = <T>(a1: string | PortSpec<any>[] | ProcedureSync<T>, a2?: PortSpec<any>[] | ProcedureSync<T>, a3?: ProcedureSync<T>) => EntityRef<T>;
export declare type AsyncStreamFactory = <T>(a1: string | PortSpec<any>[] | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureAsync<T>, a3?: ProcedureAsync<T>) => EntityRef<T>;
export declare type ValueFactory = <T>(value?: T) => EntityRef<T>;
export declare type JsonValueFactory = <T>(json?: string) => EntityRef<T>;
export interface EntityRef<T> {
    id: (_id: string, _ns?: string) => EntityRef<T>;
    val: (value: T) => EntityRef<T>;
    json: (json: string) => EntityRef<T>;
    isEvent: (_isEvent?: boolean) => EntityRef<T>;
    react: ReactionFactory<T>;
    HOT: PortSpec<T>;
    COLD: PortSpec<T>;
    getId: () => string | undefined;
    onId: (cb: (string) => void) => void;
}
export interface EntitySpec<T> {
    id?: string;
    value?: T;
    json?: string;
    processId?: string;
    procedure?: Procedure<T>;
    dependencies?: PortSpec<any>[];
    async?: boolean;
    autostart?: boolean;
}
export declare type EntityFactory = {
    val: ValueFactory;
    json: JsonValueFactory;
    stream: StreamFactory;
    asyncStream: AsyncStreamFactory;
    streamStart: StreamFactory;
    asyncStreamStart: AsyncStreamFactory;
    addToFlow: (entities: {
        [id: string]: EntityRef<any>;
    }, ns?: string) => void;
};
export declare function create(flow: Runtime): EntityFactory;
