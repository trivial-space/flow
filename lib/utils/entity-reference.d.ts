import { PortType, Runtime } from '../runtime-types';
export declare type PortSpec<T> = {
    type: PortType;
    entity: EntityRef<T>;
};
export declare type PortArgs = {
    [portId: string]: any;
} | any[];
export declare type ProcedureSync<T> = (ports: PortArgs) => T | void;
export declare type ProcedureAsync<T> = (ports: PortArgs, send: (val?: T) => void) => (() => void) | void;
export declare type Procedure<T> = ProcedureSync<T> | ProcedureAsync<T>;
export declare type ReactionFactory<T> = (a1: string | PortSpec<any>[] | Procedure<T>, a2?: PortSpec<any>[] | Procedure<T>, a3?: Procedure<T>) => EntityRef<T>;
export declare type StreamFactory = <T>(a1: string | PortSpec<any>[] | Procedure<T>, a2?: PortSpec<any>[] | Procedure<T>, a3?: Procedure<T>) => EntityRef<T>;
export declare type ValueFactory = <T>(value?: T) => EntityRef<T>;
export declare type JsonValueFactory = <T>(json?: string) => EntityRef<T>;
export declare type EntityRef<T> = {
    id: (_id: string, _ns?: string) => EntityRef<T>;
    isEvent: (_isEvent?: boolean) => EntityRef<T>;
    react: ReactionFactory<T>;
    HOT: PortSpec<T>;
    COLD: PortSpec<T>;
    getId: () => string | undefined;
    onId: (cb: (string) => void) => void;
};
export declare type EntitySpec<T> = {
    id?: string;
    value?: T;
    json?: string;
    processId?: string;
    procedure?: Procedure<T>;
    dependencies?: PortSpec<any>[];
    async?: boolean;
    autostart?: boolean;
};
export declare function create(flow: Runtime): {
    val: <T>(value?: T | undefined) => EntityRef<T>;
    json: <T>(json: string) => EntityRef<T>;
    stream: <T>(a1: string | PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T> | undefined, a3?: ProcedureSync<T> | ProcedureAsync<T> | undefined) => EntityRef<T>;
    streamStart: <T>(a1: string | PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T> | undefined, a3?: ProcedureSync<T> | ProcedureAsync<T> | undefined) => EntityRef<T>;
    asyncStream: <T>(a1: string | PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T> | undefined, a3?: ProcedureSync<T> | ProcedureAsync<T> | undefined) => EntityRef<T>;
    asyncStreamStart: <T>(a1: string | PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T>, a2?: PortSpec<any>[] | ProcedureSync<T> | ProcedureAsync<T> | undefined, a3?: ProcedureSync<T> | ProcedureAsync<T> | undefined) => EntityRef<T>;
    addToFlow: (es: any, path?: string | undefined) => void;
};
