export declare type Meta = {
    [m: string]: any;
};
export declare type AcceptPredicate<T> = (newValue: T, oldValue?: T) => boolean;
export interface EntityData {
    id?: string;
    value?: any;
    json?: string;
    accept?: AcceptPredicate<any>;
    reset?: boolean;
    meta?: Meta;
}
export interface Entity {
    id: string;
    value?: any;
    accept?: AcceptPredicate<any>;
    reset?: boolean;
    meta?: Meta;
}
export declare type PortTypeHot = 'HOT';
export declare type PortTypeCold = 'COLD';
export declare type PortTypeAccumulator = 'ACCUMULATOR';
export declare type PortType = PortTypeHot | PortTypeCold | PortTypeAccumulator;
export declare type ProcedureSync = (...args: any[]) => any;
export declare type ProcedureAsync = (send: (val?: any) => void, ...args: any[]) => any;
export declare type ProcedureDelta = (oldVal: any, newVal: any) => any;
export declare type Procedure = ProcessSync | ProcedureAsync | ProcedureDelta;
export interface ProcessDataSync {
    id?: string;
    ports?: PortType[];
    procedure?: ProcedureSync;
    code?: string;
    autostart?: boolean;
    async?: false;
    delta?: false;
    meta?: Meta;
}
export interface ProcessDataAsync {
    id?: string;
    ports?: PortType[];
    procedure?: ProcedureAsync;
    code?: string;
    autostart?: boolean;
    async: true;
    delta?: false;
    meta?: Meta;
}
export interface ProcessDataDelta {
    id?: string;
    procedure: ProcedureDelta;
    ports?: [PortTypeHot];
    code?: string;
    delta: true;
    autostart?: false;
    async?: false;
    meta?: Meta;
}
export declare type ProcessData = ProcessDataSync | ProcessDataAsync | ProcessDataDelta;
export interface ProcessSync {
    id: string;
    ports: PortType[];
    procedure: ProcedureSync;
    autostart?: boolean;
    async?: false;
    delta?: false;
    meta?: Meta;
}
export interface ProcessAsync {
    id: string;
    ports: PortType[];
    procedure: ProcedureAsync;
    autostart?: boolean;
    async: true;
    delta?: false;
    meta?: Meta;
}
export interface ProcessDelta {
    id: string;
    ports: [PortTypeHot];
    procedure: ProcedureDelta;
    delta: true;
    autostart?: false;
    async?: false;
    meta?: Meta;
}
export declare type Process = ProcessSync | ProcessAsync | ProcessDelta;
export interface ArcData {
    id?: string;
    entity: string;
    process: string;
    port?: number;
    meta?: Meta;
}
export interface Arc {
    id: string;
    entity: string;
    process: string;
    port?: number;
    meta?: Meta;
}
export interface Graph {
    entities: {
        [id: string]: Entity;
    };
    processes: {
        [id: string]: Process;
    };
    arcs: {
        [id: string]: Arc;
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
    replaceGraph: (graphSpec: GraphData) => void;
    getGraph: () => Graph;
    getState: () => {
        [id: string]: any;
    };
    setMeta: (newMeta: Meta) => Meta;
    getMeta: () => Meta;
    getContext: () => null;
    setContext: (ctx: any) => void;
    setDebug: (isDebug: boolean) => void;
    get: (id: string) => any;
    set: (id: string, value?: any) => void;
    update: (id: string, fn: (val: any) => any) => void;
    on: (id: string, cb: (val: any) => void) => void;
    off: (id: string, cb?: (val: any) => void) => void;
    start: (processId: string) => void;
    stop: (processId: string) => void;
    flush: () => void;
    PORT_TYPES: {
        readonly COLD: PortTypeCold;
        readonly HOT: PortTypeHot;
        readonly ACCUMULATOR: PortTypeAccumulator;
    };
}
export declare function createEntity({id, value, json, accept, reset, meta}: EntityData): Entity;
export declare function createProcess({id, ports, procedure, code, autostart, async, delta, meta}: ProcessData, context?: any): Process;
export declare function createArc({id, entity, process, port, meta}: ArcData): Arc;
export declare const PORT_TYPES: {
    COLD: "COLD";
    HOT: "HOT";
    ACCUMULATOR: "ACCUMULATOR";
};
