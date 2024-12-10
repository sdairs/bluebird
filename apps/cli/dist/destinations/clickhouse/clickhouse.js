import { Destination } from '../base.js';
import { createClient } from '@clickhouse/client';
const TABLE_DEFINITION = `
CREATE TABLE IF NOT EXISTS {table_name} (
    capture_time DateTime,
    collection String,
    record String
) ENGINE = MergeTree()
ORDER BY (capture_time);
`;
export class ClickHouseDestination extends Destination {
    config;
    tableName;
    client;
    insertPromises;
    monitorInterval;
    constructor(config, tableName) {
        super();
        this.config = config;
        this.tableName = tableName;
        this.client = null;
        this.insertPromises = [];
    }
    async init() {
        try {
            const settings = {
                async_insert: 1,
                wait_for_async_insert: 0,
                async_insert_max_data_size: '1000000',
                async_insert_busy_timeout_ms: 1000,
                date_time_input_format: 'best_effort',
            };
            this.client = createClient({
                host: this.config.url,
                database: this.config.database,
                username: this.config.username,
                password: this.config.password,
                max_open_connections: 10,
                compression: {
                    response: true,
                    request: true,
                },
                keep_alive: {
                    enabled: true,
                },
                clickhouse_settings: settings,
            });
            // Test connection
            const ping = await this.client.ping();
            if (!ping.success) {
                throw new Error('ClickHouse connection failed');
            }
            // Create the table if it doesn't exist
            await this.createTable();
            // Start the background task to monitor insert promises
            this.monitorInserts();
        }
        catch (error) {
            console.error('Failed to initialize ClickHouse connection:', error);
            throw error;
        }
    }
    async createTable() {
        if (!this.client)
            throw new Error('Client not initialized');
        try {
            const createTableQuery = TABLE_DEFINITION.replace('{table_name}', this.tableName);
            await this.client.command({
                query: createTableQuery,
                clickhouse_settings: {
                    wait_end_of_query: 1,
                },
            });
        }
        catch (error) {
            console.error('Failed to create table:', error);
            throw error;
        }
    }
    monitorInserts() {
        this.monitorInterval = setInterval(async () => {
            if (this.insertPromises.length === 0)
                return;
            // Get all completed promises (both successful and failed)
            const settledPromises = await Promise.allSettled(this.insertPromises);
            // Log results
            const successCount = settledPromises.filter(p => p.status === 'fulfilled').length;
            const failureCount = settledPromises.filter(p => p.status === 'rejected').length;
            if (successCount > 0) {
                console.log(`${successCount} async inserts completed successfully`);
            }
            if (failureCount > 0) {
                console.warn(`${failureCount} async inserts failed`);
                settledPromises
                    .filter(p => p.status === 'rejected')
                    .forEach(p => console.error('Insert error:', p.reason));
            }
            // Clear the processed promises
            this.insertPromises = [];
        }, 1000); // Check every second
    }
    async send(records) {
        if (!this.client)
            throw new Error('Client not initialized');
        if (!Array.isArray(records) || records.length === 0)
            return;
        try {
            const insertPromise = this.client.insert({
                table: this.tableName,
                values: records,
                format: 'JSONEachRow',
            }).catch(error => {
                console.error('Failed to insert batch:', error);
                throw error;
            });
            // Add to list of promises to monitor
            this.insertPromises.push(insertPromise);
            console.log(`Queued ${records.length} events for insertion into ClickHouse`);
        }
        catch (error) {
            console.error('Failed to queue insert batch:', error);
            throw error;
        }
    }
    async close() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        if (this.client) {
            // Wait for any pending inserts to complete
            if (this.insertPromises.length > 0) {
                console.log(`Waiting for ${this.insertPromises.length} pending inserts to complete...`);
                await Promise.allSettled(this.insertPromises);
            }
            await this.client.close();
        }
    }
}
