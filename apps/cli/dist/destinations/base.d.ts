import { Event } from "../lib/types.js";
export declare abstract class Destination {
    protected queue: Event[][];
    protected processing: boolean;
    protected maxRetries: number;
    protected baseDelay: number;
    protected maxRequestsPerSecond: number;
    protected tokens: number;
    protected lastRefill: number;
    protected refillInterval: number;
    abstract send(events: Event[]): Promise<void>;
    addBatch(events: Event[]): Promise<void>;
    init(): Promise<void>;
    protected waitForToken(): Promise<boolean>;
    protected processQueue(): Promise<void>;
}
