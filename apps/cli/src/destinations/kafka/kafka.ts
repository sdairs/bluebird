import { Destination } from '../base.js';
import { Kafka, Producer, KafkaConfig, Message } from 'kafkajs';
import { Event } from '../../lib/types.js';

// Set default to 900KB to leave room for message overhead
const DEFAULT_BATCH_SIZE_BYTES = 900 * 1024; // 900KB

export class KafkaDestination extends Destination {
  private kafka: Kafka;
  private producer: Producer;
  private connected: boolean;
  private topic: string;

  constructor(config: KafkaConfig, topic: string) {
    super();
    this.topic = topic;
    this.kafka = new Kafka(config);

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    });
    this.connected = false;
  }

  // Calculate the total size of a Kafka message including overhead
  private calculateMessageSize(event: Event): number {
    const overhead = 100; // Conservative estimate for message overhead
    return Buffer.byteLength(JSON.stringify(event), 'utf8') + overhead;
  }

  // Split events into batches that respect the size limit
  private splitIntoBatches(events: Event[]): Event[][] {
    const batches: Event[][] = [];
    let currentBatch: Event[] = [];
    let currentBatchSize = 0;

    // Account for batch-level overhead
    const batchOverhead = 100; // Conservative estimate for batch overhead
    const effectiveBatchSize = DEFAULT_BATCH_SIZE_BYTES - batchOverhead;

    for (const event of events) {
      // Calculate size of this event including message overhead
      const eventSize = this.calculateMessageSize(event);

      // If this single event is larger than max batch size, we need to handle it specially
      if (eventSize > effectiveBatchSize) {
        console.warn(`Warning: Event size ${eventSize} bytes exceeds max batch size ${DEFAULT_BATCH_SIZE_BYTES} bytes`);
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
          currentBatchSize = 0;
        }
        batches.push([event]); // Put large event in its own batch
        continue;
      }

      // If adding this event would exceed batch size, start a new batch
      if (currentBatchSize + eventSize > effectiveBatchSize && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
        currentBatchSize = 0;
      }

      // Add event to current batch
      currentBatch.push(event);
      currentBatchSize += eventSize;
    }

    // Add the last batch if it has any events
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }

  async send(events: Event[]): Promise<void> {
    try {
      await this.connect();

      // Split events into appropriately sized batches
      const batches = this.splitIntoBatches(events);

      for (const batch of batches) {
        const messages: Message[] = batch.map(event => ({
          value: JSON.stringify(event),
        }));

        console.log(`Sending batch of ${batch.length} events to Kafka topic: ${this.topic}`);

        await this.producer.send({
          topic: this.topic,
          messages: messages,
        });

        console.log(`Successfully sent batch of ${batch.length} events to Kafka topic: ${this.topic}`);
      }
    } catch (error) {
      console.error('Error sending to Kafka:', error);
      throw error;
    }
  }

  private async connect(): Promise<void> {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
  }

  async close(): Promise<void> {
    if (this.connected) {
      await this.producer.disconnect();
      this.connected = false;
    }
  }
}
