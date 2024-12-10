import { Destination } from '../destinations/base.js';
export declare class JetstreamHandler {
    private jetstream;
    private destination;
    constructor(destination: Destination, cursor?: number);
    start(): Promise<void>;
}
