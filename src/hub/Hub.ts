import { EventEmitter } from 'events';
import http2, { Http2Server, ServerHttp2Stream } from 'http2';
import Application, { TypeRoute } from './Application';
import { _route } from './Router';

export interface HubOptions {
    compress: boolean;
    useServer: boolean;
};

export interface Meta {
    rawURL: string[],
    url: string,
    query: {[key: string]: string},
    method: TypeRoute,
    headers: {[key: string]: string},
    flags: number,
    rawHeader: string[],
    data: Buffer | null,
};

class Hub extends EventEmitter {
    public  options: HubOptions;
    public app: Application;
    public server?: Http2Server;
    public protocolUse?: string;
    public port?: any[];

    constructor(options: HubOptions) {
        super();

        this.options = options;

        this.debug('Welcome to NetHubJS');

        this.app = new Application(this);

        this.server;

        this.protocolUse;

        this.port;
    };

    private get routes(): _route[] {
        return this
            .app
            .routers
            .map((router) => router.routes)
            .flat();
    };

    private debug(...msg: any) {
        this.emit('debug', ...msg);

        return this;
    };

    public core(stream: ServerHttp2Stream, headers: {[key: string]: string}, flags: number, rawHeader: any[]): void {
        const rawURL = headers[':path'].split('?');
        const url = rawURL[0];

        let query: {[key: string]: string} = {};

        if (rawURL[1]) {
            query = Object.fromEntries(rawURL[1].split("&").map((v: string) => v.split('=')));
        }

        const method = headers[':method'] as TypeRoute;

        const meta: Meta = {rawURL, url, query, method, headers, flags, rawHeader, data: null};

        this.routing(stream, meta);
    };

    private async routing(stream: ServerHttp2Stream, meta: Meta) {
        const route = this.routes.find(
            (route) => route.parseURL?.test(meta.url) && route.type?.includes(meta.method),
        );
        
        if (route) {            
            await Promise.all(
                [...route.router.middlewares.values()]
                .map(
                    (middleware) => this.createProcess (
                        middleware,
                        route.router,
                        stream,
                        meta
                    )
                )
            )
            route.callback(stream, meta);
            return;
        } else {
            if (this.app.notFound) {
                this.app.notFound(stream, meta);
                return;
            } else {
                stream.respond({
                    ':status': 404,
                });
                stream.end();
            };
        };

    };

    private createProcess(process: any, ...args: any): Promise<any> {
        return new Promise((resolve) => {
            process.call(...args, resolve);
        });
    };

    public createServer(tlsOptions: any): Http2Server {
        this.emit('debug', 'Creating server | protocol use http/2.0');

        this.server = http2.createSecureServer(tlsOptions);

        this.debug('Server creating, waiting listening ...');

        this.server.on('error', console.error);

        this.server.on('connection', (socket) => {
            this.debug('Client connected', socket.address());
        });

        this.server.on('stream', (
            stream: ServerHttp2Stream,
            headers: {[key: string]: string},
            flags: number,
            rawHeader: string[],
        ) => this.core(stream, headers, flags, rawHeader));

        return this.server;
    };
};

export default Hub;
