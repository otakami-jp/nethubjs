/// <reference types="node" />
import { EventEmitter } from 'events';
import { Http2Server, ServerHttp2Stream } from 'http2';
import Application, { TypeRoute } from './Application';
export interface HubOptions {
    compress: boolean;
    useServer: boolean;
}
export interface Meta {
    rawURL: string[];
    url: string;
    query: {
        [key: string]: string;
    };
    method: TypeRoute;
    headers: {
        [key: string]: string;
    };
    flags: number;
    rawHeader: string[];
    data: Buffer | null;
}
declare class Hub extends EventEmitter {
    options: HubOptions;
    app: Application;
    server?: Http2Server;
    protocolUse?: string;
    port?: any[];
    constructor(options: HubOptions);
    private get routes();
    private debug;
    core(stream: ServerHttp2Stream, headers: {
        [key: string]: string;
    }, flags: number, rawHeader: any[]): void;
    private routing;
    private createProcess;
    createServer(tlsOptions: any): Http2Server;
}
export default Hub;
//# sourceMappingURL=Hub.d.ts.map