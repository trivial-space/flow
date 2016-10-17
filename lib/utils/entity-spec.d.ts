import { Graph, ProcedureSync, ProcedureAsync, Meta } from "../runtime-types";
export interface EntitySpec {
    val?: any;
    stream?: ProcessSpec;
    streams?: ProcessSpec[];
    json?: string;
    isEvent?: boolean;
    meta?: Meta;
}
export interface ProcessSyncSpec {
    do: ProcedureSync;
    with?: {
        [portId: string]: string;
    };
    id?: string;
    async?: boolean;
    autostart?: false;
    meta?: Meta;
}
export interface ProcessAsyncSpec {
    do: ProcedureAsync;
    with?: {
        [portId: string]: string;
    };
    id?: string;
    async: true;
    autostart?: boolean;
    meta?: Meta;
}
export declare type ProcessSpec = ProcessSyncSpec | ProcessAsyncSpec;
export declare type Spec = {
    [id: string]: EntitySpec;
};
export declare function processProcessSpec(eid: string, spec: ProcessSpec, path?: string): Graph;
export declare function processEntitySpec(eid: string, spec: EntitySpec, path?: string): Graph;
export declare function toGraph(spec: Spec, path?: string): Graph;
