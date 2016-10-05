export declare type Meta = {
    [m: string]: any;
};
export interface EntityData {
    id?: string;
    value?: any;
    json?: string;
    isEvent?: boolean;
    meta?: Meta;
}
export interface Entity {
    id: string;
    value?: any;
    json?: string;
    isEvent?: boolean;
    meta: Meta;
}
export declare type PortType = "HOT" | "COLD" | "ACCUMULATOR";
export declare type Ports = {
    [portId: string]: PortType;
};
export declare type Procedure = (ports: {
    [portId: string]: any;
}, send?: (val: any) => void) => any;
export interface ProcessData {
    id?: string;
    ports?: Ports;
    procedure?: Procedure;
    code?: string;
    autostart?: boolean;
    async?: boolean;
    meta?: Meta;
}
export interface Process {
    id: string;
    ports: Ports;
    procedure: Procedure;
    code: string;
    autostart?: boolean;
    async?: boolean;
    meta: Meta;
}
export interface ArcData {
    id?: string;
    entity: string;
    process: string;
    port?: string;
    meta?: Meta;
}
export interface Arc {
    id: string;
    entity: string;
    process: string;
    port?: string;
    meta: Meta;
}
export interface Graph {
    entities: EntityData[];
    processes: ProcessData[];
    arcs: ArcData[];
    meta?: Meta;
}
export declare function createEntity({id, value, json, isEvent, meta}: EntityData): Entity;
export declare function createProcess({id, ports, procedure, code, autostart, async, meta}: ProcessData, context: any): Process;
export declare function createArc({id, entity, process, port, meta}: ArcData): Arc;
export declare const PORT_TYPES: {
    COLD: "HOT" | "COLD" | "ACCUMULATOR";
    HOT: "HOT" | "COLD" | "ACCUMULATOR";
    ACCUMULATOR: "HOT" | "COLD" | "ACCUMULATOR";
};
