import { BatchProcessor } from './batch-processor.js'

export class TinybirdProcessor extends BatchProcessor {
  constructor(token, endpoint, datasource) {
    super()
    this.token = token
    this.endpoint = endpoint
    this.datasource = datasource
  }

  async processBatch(events) {
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
