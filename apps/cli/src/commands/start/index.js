import { Command, Flags } from '@oclif/core'
import { Jetstream } from '@skyware/jetstream'
import { TinybirdProcessor } from '../../utils/tinybird-processor.js'
import { KafkaProcessor } from '../../utils/kafka-processor.js'

export default class Start extends Command {
  static description = 'Start the bluebird feed'

  static examples = [
    `<%= config.bin %> <%= command.id %> --tinybird-token e.XXX --tinybird-endpoint https://api.tinybird.co --tinybird-datasource bluebird_feed`,
    `<%= config.bin %> <%= command.id %> --kafka-brokers localhost:9092 --kafka-topic bluebird`,
    `<%= config.bin %> <%= command.id %> --kafka-brokers broker:9092 --kafka-topic bluebird --kafka-username user --kafka-password pass --kafka-sasl-mechanism scram-sha-512`,
    `<%= config.bin %> <%= command.id %> --kafka-brokers broker:9092 --kafka-topic bluebird --kafka-batch-size 2097152`,
  ]

  static flags = {
    // Tinybird flags
    'tinybird-token': Flags.string({ description: 'Tinybird token', required: false, char: 't' }),
    'tinybird-endpoint': Flags.string({ description: 'Tinybird endpoint', required: false, char: 'e' }),
    'tinybird-datasource': Flags.string({ description: 'Tinybird datasource', required: false, char: 'd' }),
    
    // Kafka flags
    'kafka-brokers': Flags.string({ description: 'Kafka brokers (comma-separated)', required: false }),
    'kafka-topic': Flags.string({ description: 'Kafka topic', required: false }),
    'kafka-client-id': Flags.string({ description: 'Kafka client ID', required: false, default: 'bluebird-producer' }),
    'kafka-username': Flags.string({ description: 'Kafka SASL username', required: false }),
    'kafka-password': Flags.string({ description: 'Kafka SASL password', required: false }),
    'kafka-sasl-mechanism': Flags.string({
      description: 'Kafka SASL mechanism',
      required: false,
      default: 'plain',
      options: ['plain', 'scram-sha-256', 'scram-sha-512']
    }),
    'kafka-batch-size': Flags.integer({
      description: 'Maximum batch size in bytes (default: 900KB)',
      required: false,
      default: 900 * 1024
    }),
    
    // Common flags
    cursor: Flags.string({ description: 'Cursor (Unix microseconds)', required: false, char: 'c' }),
  }

  async run() {
    const { flags } = await this.parse(Start)

    this.log(`running start command with flags: ${JSON.stringify(flags)}`)

    // Initialize the appropriate processor
    let batchProcessor
    if (flags['tinybird-token'] && flags['tinybird-endpoint'] && flags['tinybird-datasource']) {
      batchProcessor = new TinybirdProcessor(flags['tinybird-token'], flags['tinybird-endpoint'], flags['tinybird-datasource'])
    } else if (flags['kafka-brokers'] && flags['kafka-topic']) {
      batchProcessor = new KafkaProcessor({
        brokers: flags['kafka-brokers'].split(','),
        topic: flags['kafka-topic'],
        clientId: flags['kafka-client-id'],
        username: flags['kafka-username'],
        password: flags['kafka-password'],
        saslMechanism: flags['kafka-sasl-mechanism'],
        maxBatchSizeBytes: flags['kafka-batch-size']
      })
    } else {
      this.error('Must provide either Tinybird credentials or Kafka configuration')
      return
    }

    let events = []
    let cursor = flags.cursor ? flags.cursor : Date.now() * 1000
    const batchSize = 5000

    const captureEvent = (collection, event) => {
      events.push(JSON.stringify({
        capture_time: new Date().toISOString(),
        collection,
        record: event,
      }))
      if (events.length >= batchSize) {
        batchProcessor.addBatch([...events])
        this.log(`queued ${events.length} events for processing`)
        events = []
      }
    }

    const jetstream = new Jetstream({
      cursor,
    });
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
