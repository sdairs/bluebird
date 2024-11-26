import { Command, Flags, Args } from '@oclif/core'
import { Jetstream } from '@skyware/jetstream'
import { TinybirdDestination } from '../../destinations/tinybird/tinybird.js'
import { KafkaDestination } from '../../destinations/kafka/kafka.js'
import { ClickHouseDestination } from '../../destinations/clickhouse/clickhouse.js'

export default class Start extends Command {
  static description = 'Start the bluebird feed'

  static examples = [
    `<%= config.bin %> <%= command.id %> tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed`,
    `<%= config.bin %> <%= command.id %> kafka --brokers localhost:9092 --topic bluebird`,
    `<%= config.bin %> <%= command.id %> kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512`,
    `<%= config.bin %> <%= command.id %> kafka --brokers broker:9092 --topic bluebird --batch-size 2097152`,
    `<%= config.bin %> <%= command.id %> clickhouse --url http://localhost:8123 --database default --table bluebird`,
  ]

  static args = {
    destination: Args.string({
      description: 'Destination to send data to',
      required: true,
      options: ['tinybird', 'kafka', 'clickhouse']
    })
  }

  static flags = {
    // Common flags
    cursor: Flags.string({ description: 'Cursor (Unix microseconds)', required: false, char: 'c' }),

    // Tinybird flags
    token: Flags.string({
      description: 'Tinybird token',
      required: false,
    }),
    endpoint: Flags.string({
      description: 'Tinybird endpoint',
      required: false,
    }),
    datasource: Flags.string({
      description: 'Tinybird datasource',
      required: false,
    }),

    // Kafka flags
    brokers: Flags.string({
      description: 'Kafka brokers (comma-separated)',
      required: false,
    }),
    topic: Flags.string({
      description: 'Kafka topic',
      required: false,
    }),
    'client-id': Flags.string({
      description: 'Kafka client ID',
      required: false,
      default: 'bluebird-producer',
    }),
    username: Flags.string({
      description: 'Kafka SASL username',
      required: false,
    }),
    password: Flags.string({
      description: 'Kafka SASL password',
      required: false,
    }),
    'sasl-mechanism': Flags.string({
      description: 'Kafka SASL mechanism',
      required: false,
      default: 'plain',
      options: ['plain', 'scram-sha-256', 'scram-sha-512'],
    }),
    'batch-size': Flags.integer({
      description: 'Maximum batch size in bytes (default: 900KB)',
      required: false,
      default: 900 * 1024,
    }),

    // ClickHouse flags
    url: Flags.string({
      description: 'ClickHouse URL (e.g., http://localhost:8123)',
      required: false,
      default: 'http://localhost:8123',
    }),
    database: Flags.string({
      description: 'ClickHouse database',
      required: false,
      default: 'default',
    }),
    username: Flags.string({
      description: 'ClickHouse username',
      required: false,
      default: 'default',
    }),
    password: Flags.string({
      description: 'ClickHouse password',
      required: false,
      default: '',
    }),
    table: Flags.string({
      description: 'ClickHouse table name',
      required: false,
    })
  }

  async run() {
    const { args, flags } = await this.parse(Start)

    this.log(`running start command with destination: ${args.destination} and flags: ${JSON.stringify(flags)}`)

    // Initialize the appropriate processor
    let destination
    switch (args.destination) {
      case 'tinybird':
        if (!flags.token || !flags.endpoint || !flags.datasource) {
          this.error('Tinybird destination requires token, endpoint, and datasource')
        }
        destination = new TinybirdDestination(
          flags.token,
          flags.endpoint,
          flags.datasource
        )
        break

      case 'kafka':
        if (!flags.brokers || !flags.topic) {
          this.error('Kafka destination requires brokers and topic')
        }
        destination = new KafkaDestination({
          brokers: flags.brokers.split(','),
          topic: flags.topic,
          clientId: flags['client-id'],
          username: flags.username,
          password: flags.password,
          saslMechanism: flags['sasl-mechanism'],
          batchSize: flags['batch-size']
        })
        break

      case 'clickhouse':
        if (!flags.table) {
          this.error('ClickHouse destination requires table name')
        }
        destination = new ClickHouseDestination({
          url: flags.url,
          database: flags.database,
          username: flags.username,
          password: flags.password,
          tableName: flags.table
        })
        break

      default:
        this.error(`Unknown destination: ${args.destination}`)
    }

    await destination.initialize()

    let events = []
    let cursor = flags.cursor ? flags.cursor : Date.now() * 1000
    const batchSize = 5000

    const captureEvent = (collection, event) => {
      events.push({
        capture_time: new Date(),
        collection,
        record: event,
      })
      if (events.length >= batchSize) {
        destination.addBatch([...events])
        this.log(`queued ${events.length} events for processing`)
        events = []
      }
    }

    // Initialize Jetstream
    const jetstream = new Jetstream({
      cursor: flags.cursor,
      processor: destination
    })
    jetstream.on('commit', (event) => {
      captureEvent('commit', event)
      // this.log(`commit: ${JSON.stringify(event)}`)
    })
    jetstream.on('account', (event) => {
      captureEvent('account', event)
      // this.log(`account: ${JSON.stringify(event)}`)
    })
    jetstream.on('identity', (event) => {
      captureEvent('identity', event)
      // this.log(`identity: ${JSON.stringify(event)}`)
    })
    jetstream.start()

  }
}
