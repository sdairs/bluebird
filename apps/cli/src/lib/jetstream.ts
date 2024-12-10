import { Jetstream, CommitEvent, IdentityEvent, AccountEvent, Collection } from '@skyware/jetstream';
import { Destination } from '../destinations/base.js';
import { Event } from './types.js';

export class JetstreamHandler {
  private jetstream: Jetstream;
  private destination: Destination;

  constructor(destination: Destination, cursor?: number) {
    this.destination = destination;
    this.destination.init();
    this.jetstream = new Jetstream({
      cursor: cursor ?? undefined
    })
  }

  async start(): Promise<void> {

    let events: Event[] = [];
    const batchSize = 5000;

    const captureEvent = (collection: string, event: CommitEvent<Collection> | IdentityEvent | AccountEvent) => {
      events.push({
        capture_time: new Date(),
        collection,
        record: event,
      })
      if (events.length >= batchSize) {
        this.destination.addBatch([...events])
        console.log(`Added ${events.length} events to processing queue`)
        events = []
      }
    }

    this.jetstream.on('commit', (event) => {
      captureEvent('commit', event)
      // this.log(`commit: ${JSON.stringify(event)}`)
    })
    this.jetstream.on('account', (event) => {
      captureEvent('account', event)
      // this.log(`account: ${JSON.stringify(event)}`)
    })
    this.jetstream.on('identity', (event) => {
      captureEvent('identity', event)
      // this.log(`identity: ${JSON.stringify(event)}`)
    })
    this.jetstream.start()
  }
}
