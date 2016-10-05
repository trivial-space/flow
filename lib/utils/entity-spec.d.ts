import { Graph, Procedure, Meta } from "../runtime-types";
export interface EntitySpec {
    val?: any;
    stream?: ProcessSpec;
    streams?: ProcessSpec[];
    json?: string;
    isEvent?: boolean;
    meta?: Meta;
}
export interface ProcessSpec {
    do: Procedure;
    with?: {
        [portId: string]: string;
    };
    id?: string;
    async?: boolean;
    autostart?: boolean;
    meta?: Meta;
}
export declare type Spec = {
    [id: string]: EntitySpec;
};
export declare function processProcessSpec(eid: string, spec: ProcessSpec, path?: string): Graph;
export declare function processEntitySpec(eid: string, spec: EntitySpec, path?: string): Graph;
export declare function toGraph(spec: Spec, path?: string): Graph;
