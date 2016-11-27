import { PortType, Runtime } from '../runtime-types';
export interface PortSpec<T> {
    type: PortType;
    entity: EntityRef<T>;
}
export declare type ProcedureSync<T> = (ports: {
    [portId: string]: any;
}) => T | undefined;
export declare type ProcedureAsync<T> = (ports: {
    [portId: string]: any;
}, send: (val?: T) => void) => any;
export interface ProcessSyncSpec<T> {
    do: ProcedureSync<T>;
    with?: {
        [portId: string]: PortSpec<any>;
    };
    id?: string;
    async?: false;
    autostart?: boolean;
}
export interface ProcessAsyncSpec<T> {
    do: ProcedureAsync<T>;
    with?: {
        [portId: string]: PortSpec<any>;
    };
    id?: string;
    async: true;
    autostart?: boolean;
}
export declare type ProcessSpec<T> = ProcessSyncSpec<T> | ProcessAsyncSpec<T>;
export interface EntityRef<T> {
    id: (_id: string) => EntityRef<T>;
    value: (_value: T) => EntityRef<T>;
    json: (_json: string) => EntityRef<T>;
    isEvent: (_isEvent?: boolean) => EntityRef<T>;
    stream: (spec: ProcessSpec<T>) => EntityRef<T>;
    HOT: PortSpec<T>;
    COLD: PortSpec<T>;
    SELF: PortSpec<T>;
    getId: () => string;
    onId: (cb: (string) => void) => void;
}
export interface EntityFactory {
    SELF: PortSpec<any>;
    <T>(value?: T): EntityRef<T>;
}
export declare function create(flow: Runtime): {
    entity: EntityFactory;
    addToFlow: (es: any, path?: string | undefined) => void;
    SELF: PortSpec<any>;
};
