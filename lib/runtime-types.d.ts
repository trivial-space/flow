export declare type Meta = {
    [m: string]: any;
};
export interface EntityData {
    id?: string;
    value?: any;
    json?: string;
    meta?: Meta;
}
export interface Entity {
    id: string;
    value?: any;
    json?: string;
    meta: Meta;
}
export declare type PortTypeHot = "HOT";
export declare type PortTypeCold = "COLD";
export declare type PortTypeAccumulator = "ACCUMULATOR";
export declare type PortType = PortTypeHot | PortTypeCold | PortTypeAccumulator;
export declare type ProcedureSync = (...args: any[]) => any;
export declare type ProcedureAsync = (send: (val?: any) => void, ...args: any[]) => any;
export declare type Procedure = ProcessSync | ProcedureAsync;
export interface ProcessDataSync {
    id?: string;
    ports?: PortType[];
    procedure?: ProcedureSync;
    code?: string;
    autostart?: boolean;
    async?: false;
    meta?: Meta;
}
export interface ProcessDataAsync {
    id?: string;
    ports?: PortType[];
    procedure?: ProcedureAsync;
    code?: string;
    autostart?: boolean;
    async: true;
    meta?: Meta;
}
export declare type ProcessData = ProcessDataSync | ProcessDataAsync;
export interface ProcessSync {
    id: string;
    ports: PortType[];
    procedure: ProcedureSync;
    code: string;
    autostart?: boolean;
    async: false;
    meta: Meta;
}
export interface ProcessAsync {
    id: string;
    ports: PortType[];
    procedure: ProcedureAsync;
    code: string;
    autostart?: boolean;
    async: true;
    meta: Meta;
}
export declare type Process = ProcessSync | ProcessAsync;
export interface ArcData {
    id?: string;
    entity: string;
    process: string;
    port?: number | string;
    meta?: Meta;
}
export interface Arc {
    id: string;
    entity: string;
    process: string;
    port?: number | string;
    meta: Meta;
}
export interface Graph {
    entities: {
        [id: string]: EntityData;
    };
    processes: {
        [id: string]: ProcessData;
    };
    arcs: {
        [id: string]: ArcData;
    };
    meta?: Meta;
}
export interface GraphData {
    entities?: EntityData[] | {
        [id: string]: EntityData;
    };
    processes?: ProcessData[] | {
        [id: string]: ProcessData;
    };
    arcs?: ArcData[] | {
        [id: string]: ArcData;
    };
    meta?: Meta;
}
export interface Runtime {
    addEntity: (spec: EntityData) => Entity;
    removeEntity: (id: string) => void;
    addProcess: (spec: ProcessData) => Process;
    removeProcess: (id: string) => void;
    addArc: (spec: ArcData) => Arc;
    removeArc: (id: string) => void;
    addGraph: (graphSpec: GraphData) => void;
    getGraph: () => Graph;
    getState: () => {};
    setMeta: (newMeta: any) => void;
    getMeta: () => Meta;
    getContext: () => null;
    setContext: (ctx: any) => void;
    setDebug: (isDebug: boolean) => void;
    get: (id: string) => any;
    set: (id: string, value?: any) => void;
    update: (id: string, fn: (val: any) => any) => void;
    on: (id: string, cb: (val: any) => void) => void;
    off: (id: string) => void;
    start: (processId: string) => void;
    stop: (processId: string) => void;
    flush: () => void;
    PORT_TYPES: {
        readonly COLD: PortTypeCold;
        readonly HOT: PortTypeHot;
        readonly ACCUMULATOR: PortTypeAccumulator;
    };
}
export declare function createEntity({id, value, json, meta}: EntityData): Entity;
export declare function createProcess({id, ports, procedure, code, autostart, async, meta}: ProcessData, context?: any): Process;
export declare function createArc({id, entity, process, port, meta}: ArcData): Arc;
export declare const PORT_TYPES: {
    COLD: "COLD";
    HOT: "HOT";
    ACCUMULATOR: "ACCUMULATOR";
};
