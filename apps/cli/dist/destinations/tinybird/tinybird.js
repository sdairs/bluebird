import { Destination } from '../base.js';
export class TinybirdDestination extends Destination {
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    async send(events) {
        const jsonl = events.map(event => JSON.stringify(event)).join('\n');
        const tinybird_url = `${this.config.endpoint}/v0/events?name=${this.config.datasource}`;
        const response = await fetch(tinybird_url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.config.token}`,
                'Content-Type': 'application/json',
            },
            body: jsonl,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Successfully sent ${events.length} events to Tinybird`);
        return await response.json();
    }
}
