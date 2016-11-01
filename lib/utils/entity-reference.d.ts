import { PortType, Runtime, ProcedureSync, ProcedureAsync } from '../runtime-types';
export interface PortSpec {
    type: PortType;
    entity: EntityRef;
}
export interface ProcessSyncSpec {
    do: ProcedureSync;
    with?: {
        [portId: string]: PortSpec;
    };
    id?: string;
    async?: false;
    autostart?: boolean;
}
export interface ProcessAsyncSpec {
    do: ProcedureAsync;
    with?: {
        [portId: string]: PortSpec;
    };
    id?: string;
    async: true;
    autostart?: boolean;
}
export declare type ProcessSpec = ProcessSyncSpec | ProcessAsyncSpec;
export interface EntityRef {
    id: (_id: string) => EntityRef;
    value: (_value: any) => EntityRef;
    json: (_json: string) => EntityRef;
    isEvent: (_isEvent?: boolean) => EntityRef;
    stream: (spec: ProcessSpec) => EntityRef;
    HOT: PortSpec;
    COLD: PortSpec;
    SELF: PortSpec;
    getId: () => string;
    onId: (cb: (string) => void) => void;
}
export interface EntityFactory {
    SELF: PortSpec;
    (any?: any): EntityRef;
}
export declare function create(flow: Runtime): {
    entity: EntityFactory;
    addToFlow: (es: any, path?: string | undefined) => void;
    SELF: PortSpec;
};
