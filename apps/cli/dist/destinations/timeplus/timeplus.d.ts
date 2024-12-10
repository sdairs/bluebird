import { Destination } from '../base.js';
import { Event } from '../../lib/types.js';
interface TimeplusConfig {
    token: string;
    endpoint: string;
    stream: string;
}
export declare class TimeplusDestination extends Destination {
    private config;
    constructor(config: TimeplusConfig);
    init(): Promise<void>;
    send(events: Event[]): Promise<void>;
}
export {};
