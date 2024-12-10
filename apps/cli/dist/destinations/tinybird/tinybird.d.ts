import { Destination } from '../base.js';
interface TinybirdConfig {
    token: string;
    endpoint: string;
    datasource: string;
}
export declare class TinybirdDestination extends Destination {
    private config;
    constructor(config: TinybirdConfig);
    send(events: any[]): Promise<void>;
}
export {};
