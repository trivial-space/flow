import * as r from "./runtime";
import * as entityRef from './utils/entity-reference';
import * as graph from './utils/graph-utils';
import * as t from './runtime-types';
export default r;
export declare const runtime: typeof r;
export declare const create: typeof r.create;
export declare const types: typeof t;
export declare const utils: {
    entityRef: typeof entityRef;
    graph: typeof graph;
};
