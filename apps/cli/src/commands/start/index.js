import { Command, Flags } from '@oclif/core'
import { Jetstream } from '@skyware/jetstream'

export default class Start extends Command {
  static description = 'Start the bluebird feed'

  static examples = [
    `<%= config.bin %> <%= command.id %> --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed (./src/commands/start/index.ts)
`,
  ]

  static flags = {
    token: Flags.string({ description: 'Tinybird token', required: true, char: 't' }),
    endpoint: Flags.string({ description: 'Tinybird endpoint', required: true, char: 'e' }),
    datasource: Flags.string({ description: 'Tinybird datasource', required: true, char: 'd' }),
    cursor: Flags.string({ description: 'Cursor (Unix microseconds)', required: false, char: 'c' }),
  }

  async run() {
    const { flags } = await this.parse(Start)

    this.log(`running start command with flags: ${JSON.stringify(flags)}`)

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
        sendToTinybird([...events], flags.token, flags.endpoint, flags.datasource)
        this.log(`sent ${events.length} events to Tinybird`)
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

async function sendToTinybird(events, token, endpoint, datasource) {
  try {
    // Convert events array to JSONL string
    const jsonl = events.join('\n')

    // Send to Tinybird Events API
    let tinybird_url = `${endpoint}/v0/events?name=${datasource}`
    const response = await fetch(tinybird_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: jsonl,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    console.log(`sent ${events.length} events to Tinybird`)
    return await response.json()
  } catch (error) {
    console.error('Error sending events to Tinybird:', error)
    throw error
  }
}
