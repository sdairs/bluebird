import { Command, Flags } from '@oclif/core'
import { Jetstream } from '@skyware/jetstream'

class BatchProcessor {
  constructor(token, endpoint, datasource) {
    this.token = token
    this.endpoint = endpoint
    this.datasource = datasource
    this.queue = []
    this.processing = false
    this.maxRetries = 5
    this.baseDelay = 1000 // 1 second
    
    // Rate limiting configuration
    this.maxRequestsPerSecond = 5
    this.tokens = this.maxRequestsPerSecond
    this.lastRefill = Date.now()
    this.refillInterval = 1000 // 1 second in milliseconds
  }

  async addBatch(events) {
    this.queue.push([...events])
    if (!this.processing) {
      this.processing = true
      this.processQueue().catch(console.error)
    }
  }

  async waitForToken() {
    const now = Date.now()
    const timeSinceLastRefill = now - this.lastRefill
    
    // Refill tokens based on time elapsed
    if (timeSinceLastRefill >= this.refillInterval) {
      this.tokens = this.maxRequestsPerSecond
      this.lastRefill = now
    }

    // If no tokens available, wait until next refill
    if (this.tokens <= 0) {
      const waitTime = this.refillInterval - timeSinceLastRefill
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.waitForToken()
    }

    this.tokens--
    return true
  }

  async processQueue() {
    while (this.queue.length > 0) {
      const batch = this.queue[0]
      let success = false
      let retryCount = 0

      while (!success && retryCount < this.maxRetries) {
        try {
          await this.waitForToken() // Wait for rate limit token
          await this.sendBatch(batch)
          success = true
          this.queue.shift() // Remove the processed batch
        } catch (error) {
          retryCount++
          if (retryCount === this.maxRetries) {
            console.error(`Failed to send batch after ${this.maxRetries} retries:`, error)
            this.queue.shift() // Remove the failed batch after max retries
          } else {
            const delay = this.baseDelay * Math.pow(2, retryCount - 1)
            console.log(`Retry ${retryCount} after ${delay}ms`)
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }
    }
    this.processing = false
  }

  async sendBatch(events) {
    const jsonl = events.join('\n')
    const tinybird_url = `${this.endpoint}/v0/events?name=${this.datasource}`
    const response = await fetch(tinybird_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: jsonl,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    console.log(`Successfully sent ${events.length} events to Tinybird`)
    return await response.json()
  }
}

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
    const batchSize = 100
    const batchProcessor = new BatchProcessor(flags.token, flags.endpoint, flags.datasource)

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
