import { Destination } from '../base.js';
export class TimeplusDestination extends Destination {
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    async init() {
        // validate the 3 inputs and create the stream if not exists
        const url = `${this.config.endpoint}/api/v1beta2/streams/${this.config.stream}`;
        let auth = `ApiKey ${this.config.token}`;
        if (this.config.token.length === 60) {
            console.log(`Validating API token for ${this.config.endpoint}`);
        }
        else {
            console.log('This is not an API token. Assuming it is admin:password, encoding it as base64 and validating');
            auth = `Basic ${Buffer.from(this.config.token).toString('base64')}`;
        }
        const headers = {
            Authorization: auth,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            switch (response.status) {
                case 403: {
                    throw new Error('Invalid API token');
                }
                case 404: {
                    console.log(`Stream '${this.config.stream}' doesn't exist. Creating it..`);
                    const streamConfig = {
                        name: this.config.stream,
                        description: "Bluesky feed, created by bluebird CLI.",
                        columns: [
                            { name: "capture_time", type: "datetime64(3)" },
                            { name: "collection", type: "string" },
                            { name: "record", type: "string" }
                        ],
                        event_time_column: "capture_time"
                    };
                    const resp = await fetch(`${this.config.endpoint}/api/v1beta2/streams`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(streamConfig),
                    });
                    if (resp.ok) {
                        console.log(`Stream '${this.config.stream}' is created.`);
                        break;
                    }
                    else {
                        throw new Error(`Failed to create the stream! status: ${resp.status}, body: ${await resp.text()}`);
                    }
                }
                default: {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${await response.text()}`);
                }
            }
        }
    }
    async send(events) {
        const jsonl = events.map((event) => JSON.stringify(event)).join('\n');
        const url = `${this.config.endpoint}/api/v1beta2/streams/${this.config.stream}/ingest?format=streaming`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `ApiKey ${this.config.token}`,
                'Content-Type': 'application/json',
            },
            body: jsonl,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${await response.text()}`);
        }
        console.log(`Successfully sent ${events.length} events to Timeplus`);
    }
}
