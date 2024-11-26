import { Destination } from '../destination.js'
import { createClient } from '@clickhouse/client'

const TABLE_DEFINITION = `
CREATE TABLE IF NOT EXISTS {table_name} (
    capture_time DateTime,
    collection String,
    record String
) ENGINE = MergeTree()
ORDER BY (capture_time);
`

export class ClickHouseDestination extends Destination {
    constructor({
        url,
        database,
        username,
        password,
        tableName
    }) {
        super()
        this.config = {
            url: url || 'http://localhost:8123',
            database: database || 'default',
            username: username || 'default',
            password: password || '',
        }
        this.tableName = tableName
        this.client = null
        this.insertPromises = []
    }

    async initialize() {
        try {
            this.client = createClient({
                url: this.config.url,
                database: this.config.database,
                username: this.config.username,
                password: this.config.password,
                max_open_connections: 10,
                compression: {
                    response: true,
                    request: true
                },
                keep_alive: {
                    enabled: true
                },
                clickhouse_settings: {
                    // https://clickhouse.com/docs/en/operations/settings/settings#async-insert
                    async_insert: 1,
                    // https://clickhouse.com/docs/en/operations/settings/settings#wait-for-async-insert
                    // explicitly disable it on the client side;
                    // insert operations promises will be resolved as soon as the request itself was processed on the server.
                    wait_for_async_insert: 0,
                    // https://clickhouse.com/docs/en/operations/settings/settings#async-insert-max-data-size
                    async_insert_max_data_size: '1000000',
                    // https://clickhouse.com/docs/en/operations/settings/settings#async-insert-busy-timeout-ms
                    async_insert_busy_timeout_ms: 1000,
                    date_time_input_format: 'best_effort',
                },
            })

            // Test connection
            await this.client.ping()

            // Check if table exists
            const tableExists = await this.checkTableExists()

            if (!tableExists) {
                await this.createTable()
            }

            // Start the background task to monitor insert promises
            this.monitorInserts()
        } catch (error) {
            console.error('Failed to initialize ClickHouse connection:', error)
            throw error
        }
    }

    async checkTableExists() {
        try {
            const result = await this.client.query({
                query: `
                    SELECT count() 
                    FROM system.tables 
                    WHERE database = '${this.config.database}' 
                    AND name = '${this.tableName}'
                `
            })

            const data = await result.json()
            return data.data[0]['count()'] > 0
        } catch (error) {
            console.error('Failed to check table existence:', error)
            throw error
        }
    }

    async createTable() {
        try {
            const createTableQuery = TABLE_DEFINITION.replace('{table_name}', this.tableName)

            // Execute the create table query
            await this.client.query({
                query: createTableQuery
            })
        } catch (error) {
            console.error('Failed to create table:', error)
            throw error
        }
    }

    monitorInserts() {
        setInterval(async () => {
            if (this.insertPromises.length === 0) return

            // Get all completed promises (both successful and failed)
            const settledPromises = await Promise.allSettled(this.insertPromises)

            // Log results
            const successCount = settledPromises.filter(p => p.status === 'fulfilled').length
            const failureCount = settledPromises.filter(p => p.status === 'rejected').length

            if (successCount > 0) {
                console.log(`${successCount} async inserts completed successfully`)
            }
            if (failureCount > 0) {
                console.warn(`${failureCount} async inserts failed`)
                settledPromises
                    .filter(p => p.status === 'rejected')
                    .forEach(p => console.error('Insert error:', p.reason))
            }

            // Clear the processed promises
            this.insertPromises = []
        }, 1000) // Check every second
    }

    async processBatch(records) {
        if (!Array.isArray(records) || records.length === 0) {
            return
        }

        try {
            const insertPromise = this.client.insert({
                table: this.tableName,
                values: records,
                format: 'JSONEachRow',
            }).catch(error => {
                console.error('Failed to insert batch:', error)
                throw error
            })

            // Add to list of promises to monitor
            this.insertPromises.push(insertPromise)

            console.log(`Queued ${records.length} events for insertion into ClickHouse`)
        } catch (error) {
            console.error('Failed to queue insert batch:', error)
            throw error
        }
    }

    async close() {
        if (this.client) {
            // Wait for any pending inserts to complete
            if (this.insertPromises.length > 0) {
                console.log(`Waiting for ${this.insertPromises.length} pending inserts to complete...`)
                await Promise.allSettled(this.insertPromises)
            }
            await this.client.close()
        }
    }
}
