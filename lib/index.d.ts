import * as r from "./runtime";
import * as entitySpec from './utils/entity-spec';
import * as entityRef from './utils/entity-reference';
import * as t from './runtime-types';
export default r;
export declare const runtime: typeof r;
export * from './runtime';
export declare const types: typeof t;
export declare const utils: {
    entitySpec: typeof entitySpec;
    entityRef: typeof entityRef;
};
