import Hub from "./Hub";
import Router, { RouteCallback } from "./Router";
export declare type TypeRoute = 'get' | 'post' | 'put' | 'patch' | 'option' | 'delete' | 'head' | 'connect' | 'options' | 'trace';
declare class Application {
    hub: Hub;
    private _routers;
    notFound?: RouteCallback;
    constructor(hub: Hub);
    get routers(): Router[];
    createRouter(baseUrl: string): Router;
    setNotFound(callback: RouteCallback): this;
}
export default Application;
//# sourceMappingURL=Application.d.ts.map