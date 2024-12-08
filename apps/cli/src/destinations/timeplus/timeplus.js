import { Destination } from '../destination.js'

export class TimeplusDestination extends Destination {
  constructor(token, endpoint, stream) {
    super()
    this.token = token
    this.endpoint = endpoint
    this.stream = stream
  }

  async processBatch(events) {
    const jsonl = events.map(event => JSON.stringify(event)).join('\n')
    const url = `${this.endpoint}/api/v1beta2/streams/${this.stream}/ingest?format=lines`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: jsonl,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    console.log(`Successfully sent ${events.length} events to Timeplus`)
    return await response.json()
  }
}
