import * as types from './runtime-types';
export declare function create(): {
    addEntity: (spec: types.EntityData) => types.Entity;
    removeEntity: (id: string) => void;
    addProcess: (spec: types.ProcessData) => types.Process;
    removeProcess: (id: string) => void;
    addArc: (spec: types.ArcData) => types.Arc;
    removeArc: (id: string) => void;
    addGraph: (graphSpec: types.Graph) => void;
    getGraph: () => {
        entities: {};
        processes: {};
        arcs: {};
        meta: {};
    };
    getState: () => {};
    setMeta: (newMeta: any) => void;
    getMeta: () => {};
    getContext: () => null;
    setContext: (ctx: any) => void;
    setDebug: (isDebug: any) => void;
    get: (id: string) => any;
    set: (id: string, value: any) => void;
    update: (id: string, fn: (val: any) => any) => void;
    on: (id: string, cb: (val: any) => void) => void;
    off: (id: string) => void;
    start: (processId: any) => void;
    stop: (processId: any) => void;
    PORT_TYPES: {} & {
        COLD: "HOT" | "COLD" | "ACCUMULATOR";
        HOT: "HOT" | "COLD" | "ACCUMULATOR";
        ACCUMULATOR: "HOT" | "COLD" | "ACCUMULATOR";
    };
};
