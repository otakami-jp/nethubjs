import Hub from "./Hub";
import Router, { RouteCallback, _route } from "./Router";

export type TypeRoute = 'get' | 'post' | 'put' | 'patch' | 'option' | 'delete' | 'head' | 'connect' | 'options' | 'trace';

class Application {
    public hub: Hub;
    private _routers: Map<string, Router>;
    public notFound?: RouteCallback;
    constructor(hub: Hub) {
        this.hub = hub;

        this._routers = new Map();
    };

    get routers() {
        return [
            ...this._routers.values(),
        ];
    };

    createRouter(baseUrl: string) {
        const router = new Router(this, baseUrl);
        this._routers.set(baseUrl, router);

        return router;
    };

    public setNotFound(callback: RouteCallback): this {
        this.notFound = callback;

        return this;
    };
};

export default Application;
