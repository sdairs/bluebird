import { Destination } from '../base.js';
import { KafkaConfig } from 'kafkajs';
import { Event } from '../../lib/types.js';
export declare class KafkaDestination extends Destination {
    private kafka;
    private producer;
    private connected;
    private topic;
    constructor(config: KafkaConfig, topic: string);
    private calculateMessageSize;
    private splitIntoBatches;
    send(events: Event[]): Promise<void>;
    private connect;
    close(): Promise<void>;
}
