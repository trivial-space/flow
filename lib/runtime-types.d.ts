export declare type Meta = {
    [m: string]: any;
};
export declare type EntityData = {
    id?: string;
    value?: any;
    json?: string;
    isEvent?: boolean;
    meta?: Meta;
};
export declare type Entity = {
    id: string;
    value?: any;
    json?: string;
    isEvent?: boolean;
    meta: Meta;
};
export declare type PortTypeHot = "HOT";
export declare type PortTypeCold = "COLD";
export declare type PortTypeAccumulator = "ACCUMULATOR";
export declare type PortType = PortTypeHot | PortTypeCold | PortTypeAccumulator;
export declare type Ports = {
    [portId: string]: PortType;
} | PortType[];
export declare type ProcedureSync = (ports: {
    [portId: string]: any;
}) => any;
export declare type ProcedureAsync = (ports: {
    [portId: string]: any;
}, send: (val?: any) => void) => any;
export declare type Procedure = ProcessSync | ProcedureAsync;
export declare type ProcessData = {
    id?: string;
    ports?: Ports;
    procedure?: Procedure;
    code?: string;
    autostart?: boolean;
    async?: boolean;
    meta?: Meta;
};
export declare type ProcessSync = {
    id: string;
    ports: Ports;
    procedure: ProcedureSync;
    code: string;
    autostart?: boolean;
    async: false;
    meta: Meta;
};
export declare type ProcessAsync = {
    id: string;
    ports: Ports;
    procedure: ProcedureAsync;
    code: string;
    autostart?: boolean;
    async: true;
    meta: Meta;
};
export declare type Process = ProcessSync | ProcessAsync;
export declare type ArcData = {
    id?: string;
    entity: string;
    process: string;
    port?: string | number;
    meta?: Meta;
};
export declare type Arc = {
    id: string;
    entity: string;
    process: string;
    port?: string | number;
    meta: Meta;
};
export declare type Graph = {
    entities: EntityData[];
    processes: ProcessData[];
    arcs: ArcData[];
    meta?: Meta;
};
export declare type Runtime = {
    addEntity: (spec: EntityData) => Entity;
    removeEntity: (id: string) => void;
    addProcess: (spec: ProcessData) => Process;
    removeProcess: (id: string) => void;
    addArc: (spec: ArcData) => Arc;
    removeArc: (id: string) => void;
    addGraph: (graphSpec: Graph) => void;
    getGraph: () => {
        entities: {
            [id: string]: Entity;
        };
        processes: {
            [id: string]: Process;
        };
        arcs: {
            [id: string]: Arc;
        };
        meta: {};
    };
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
};
export declare function createEntity({id, value, json, isEvent, meta}: EntityData): Entity;
export declare function createProcess({id, ports, procedure, code, autostart, async, meta}: ProcessData, context?: any): Process;
export declare function createArc({id, entity, process, port, meta}: ArcData): Arc;
export declare const PORT_TYPES: {
    COLD: "COLD";
    HOT: "HOT";
    ACCUMULATOR: "ACCUMULATOR";
};
