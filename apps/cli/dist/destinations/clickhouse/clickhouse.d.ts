import { Destination } from '../base.js';
interface ClickHouseConfig {
    url: string;
    database: string;
    username: string;
    password: string;
}
export declare class ClickHouseDestination extends Destination {
    private config;
    private tableName;
    private client;
    private insertPromises;
    private monitorInterval?;
    constructor(config: ClickHouseConfig, tableName: string);
    init(): Promise<void>;
    private createTable;
    private monitorInserts;
    send(records: any[]): Promise<void>;
    close(): Promise<void>;
}
export {};
