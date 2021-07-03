/// <reference types="node" />
import { ServerHttp2Stream } from "http2";
import Application, { TypeRoute } from "./Application";
import { Meta } from "./Hub";
export declare type Chunk = string | Buffer | Uint16Array | any;
export declare type RouteMiddlewareCallback = (stream: ServerHttp2Stream, meta: Meta, next: (value: unknown) => void) => void;
export declare type RouteCallback = (stream: ServerHttp2Stream, meta: Meta) => void;
export interface _route {
    type?: TypeRoute[];
    callback: RouteCallback;
    url?: string;
    fullUrl?: string;
    parseURL?: RegExp;
    router: Router;
}
declare class Router {
    application: Application;
    baseURL: string;
    middlewares: Set<RouteMiddlewareCallback>;
    private _routes;
    constructor(application: Application, baseURL: string);
    get routes(): _route[];
    createMiddleware(callback: RouteMiddlewareCallback): this;
    createRoute(url: string, type: TypeRoute[], callback: RouteCallback): this;
    static parseRoute(url: string): RegExp;
}
export default Router;
//# sourceMappingURL=Router.d.ts.map