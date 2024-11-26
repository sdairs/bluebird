import { Destination } from '../destination.js'
import { Kafka } from 'kafkajs'

// Set default to 900KB to leave room for message overhead
const DEFAULT_BATCH_SIZE_BYTES = 900 * 1024 // 900KB

export class KafkaDestination extends Destination {
  constructor({ brokers, topic, clientId = 'bluebird-producer', compression = 'gzip', username, password, saslMechanism = 'plain', batchSize = DEFAULT_BATCH_SIZE_BYTES }) {
    super()
    this.topic = topic
    this.batchSize = batchSize
    
    const sasl = username && password ? {
      mechanism: saslMechanism.toLowerCase(),
      username,
      password
    } : null

    // Validate SASL mechanism
    if (sasl && !['plain', 'scram-sha-256', 'scram-sha-512'].includes(sasl.mechanism)) {
      throw new Error('Invalid SASL mechanism. Must be one of: plain, scram-sha-256, scram-sha-512')
    }

    const ssl = !!sasl // Enable SSL if SASL is configured

    this.kafka = new Kafka({
      clientId,
      brokers,
      ssl,
      sasl
    })

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      compression,
    })
    this.connected = false
  }

  // Calculate the total size of a Kafka message including overhead
  calculateMessageSize(event) {
    // Account for message overhead:
    // - Message headers
    // - Timestamps
    // - Key (if present)
    // - Offset
    // - Other metadata
    const overhead = 100 // Conservative estimate for message overhead
    return Buffer.byteLength(JSON.stringify(event), 'utf8') + overhead
  }

  // Split events into batches that respect the size limit
  splitIntoBatches(events) {
    const batches = []
    let currentBatch = []
    let currentBatchSize = 0
    
    // Account for batch-level overhead
    const batchOverhead = 100 // Conservative estimate for batch overhead
    const effectiveBatchSize = this.batchSize - batchOverhead

    for (const event of events) {
      // Calculate size of this event including message overhead
      const eventSize = this.calculateMessageSize(event)

      // If this single event is larger than max batch size, we need to handle it specially
      if (eventSize > effectiveBatchSize) {
        console.warn(`Warning: Event size ${eventSize} bytes exceeds max batch size ${this.batchSize} bytes`)
        if (currentBatch.length > 0) {
          batches.push(currentBatch)
          currentBatch = []
          currentBatchSize = 0
        }
        batches.push([event]) // Put large event in its own batch
        continue
      }

      // If adding this event would exceed batch size, start a new batch
      if (currentBatchSize + eventSize > effectiveBatchSize && currentBatch.length > 0) {
        batches.push(currentBatch)
        currentBatch = []
        currentBatchSize = 0
      }

      // Add event to current batch
      currentBatch.push(event)
      currentBatchSize += eventSize
    }

    // Add the last batch if it has any events
    if (currentBatch.length > 0) {
      batches.push(currentBatch)
    }

    return batches
  }

  async processBatch(events) {
    try {
      await this.connect()
      
      // Split events into appropriately sized batches
      const batches = this.splitIntoBatches(events)
      
      for (const batch of batches) {
        const messages = batch.map(event => ({
          value: JSON.stringify(event),
          timestamp: Date.now(),
        }))

        const batchSize = batch.reduce((total, event) => total + this.calculateMessageSize(event), 0)
        console.log(`Sending batch of ${batch.length} events (${batchSize} bytes) to Kafka topic: ${this.topic}`)

        await this.producer.send({
          topic: this.topic,
          messages,
        })

        console.log(`Successfully sent batch of ${batch.length} events to Kafka topic: ${this.topic}`)
      }
    } catch (error) {
      console.error('Error sending to Kafka:', error)
      throw error
    }
  }

  async connect() {
    if (!this.connected) {
      await this.producer.connect()
      this.connected = true
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.producer.disconnect()
      this.connected = false
    }
  }
}
