import { Jetstream } from '@skyware/jetstream';
export class JetstreamHandler {
    jetstream;
    destination;
    constructor(destination, cursor) {
        this.destination = destination;
        this.destination.init();
        this.jetstream = new Jetstream({
            cursor: cursor ?? undefined
        });
    }
    async start() {
        let events = [];
        const batchSize = 5000;
        const captureEvent = (collection, event) => {
            events.push({
                capture_time: new Date(),
                collection,
                record: event,
            });
            if (events.length >= batchSize) {
                this.destination.addBatch([...events]);
                console.log(`Added ${events.length} events to processing queue`);
                events = [];
            }
        };
        this.jetstream.on('commit', (event) => {
            captureEvent('commit', event);
            // this.log(`commit: ${JSON.stringify(event)}`)
        });
        this.jetstream.on('account', (event) => {
            captureEvent('account', event);
            // this.log(`account: ${JSON.stringify(event)}`)
        });
        this.jetstream.on('identity', (event) => {
            captureEvent('identity', event);
            // this.log(`identity: ${JSON.stringify(event)}`)
        });
        this.jetstream.start();
    }
}
