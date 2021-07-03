import { ServerHttp2Stream } from "http2";
import Application, { TypeRoute } from "./Application";
import { Meta } from "./Hub";

export type Chunk = string | Buffer | Uint16Array | any;

export type RouteMiddlewareCallback = (stream: ServerHttp2Stream, meta: Meta, next: (value: unknown) => void) => void;
export type RouteCallback = (stream: ServerHttp2Stream, meta: Meta) => void;

export interface _route {
    type?: TypeRoute[],
    callback: RouteCallback,
    url?: string,
    fullUrl?: string,
    parseURL?: RegExp,
    router: Router,
};

class Router {
    public application: Application;
    public baseURL: string;
    public middlewares: Set<RouteMiddlewareCallback>;
    private _routes: Map<string, _route>;
    constructor(application: Application, baseURL: string) {
        this.application = application;

        this.baseURL = baseURL;

        this.middlewares = new Set();
        this._routes = new Map();
    };

    public get routes(): _route[] {
        return [
            ...this._routes.values(),
        ];
    };

    public createMiddleware(callback: RouteMiddlewareCallback): this {
        this.middlewares.add(callback);

        return this;
    };

    public createRoute(url: string, type: TypeRoute[], callback: RouteCallback): this {
        this._routes.set(url, {
            type,
            callback,
            url,
            fullUrl: this.baseURL + url,
            parseURL: Router.parseRoute(this.baseURL + url),
            router: this,
        });

        return this;
    };

    public static parseRoute(url: string): RegExp {
        let segments = url.split('/');
        segments = segments.map((segment) => segment.includes(':') ? ':(\w)' : segment);
        return new RegExp('^' + segments.join('/') + '$', 'gm');
    };
};

export default Router;