import {Command, Flags} from '@oclif/core'
import {Firehose, MemoryRunner} from '@atproto/sync'
import {IdResolver} from '@atproto/identity'

export default class Start extends Command {
  static description = 'Start the bluebird feed'

  static examples = [
    `<%= config.bin %> <%= command.id %> --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed (./src/commands/start/index.ts)
`,
  ]

  static flags = {
    tinybird_token: Flags.string({description: 'Tinybird token', required: true}),
    tinybird_endpoint: Flags.string({description: 'Tinybird endpoint', required: true}),
    tinybird_datasource: Flags.string({description: 'Tinybird datasource', required: true}),
  }

  async run() {
    const {flags} = await this.parse(Start)

    this.log(`running start command with flags: ${JSON.stringify(flags)}`)

    let events = []
    let currentTime = new Date()
    const batchSize = 5000

    const idResolver = new IdResolver()
    const runner = new MemoryRunner({
      setCursor: (cursor) => {
        // this.log(`cursor: ${cursor}`)
      },
    })
    const firehose = new Firehose({
      idResolver,
      runner,
      service: 'wss://bsky.network',
      handleEvent: async (event) => {
        // this.log(`event: ${JSON.stringify(evt)}`)
        events.push(event)
        if (events.length >= batchSize) {
          // this.log(`events: ${JSON.stringify(events)}`)
          this.log(`time to ${batchSize} events: ${new Date() - currentTime}ms`)
          currentTime = new Date()
          sendToTinybird(events, flags.tinybird_token, flags.tinybird_endpoint, flags.tinybird_datasource)
          events = []
        }
      },
      onError: (err) => {
        // console.error(err)
      },
      unauthenticatedHandles: true,
      unauthenticatedCommits: true,
    })
    firehose.start()
  }
}

async function sendToTinybird(events, token, endpoint, datasource) {
  try {
    // Convert events array to JSONL format
    const jsonl = events.map((evt) => JSON.stringify(evt)).join('\n')

    // Send to Tinybird Events API
    const response = await fetch(`${endpoint}/v0/events?name=${datasource}`, {
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
