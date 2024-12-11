# Bluebird

Bluebird is a CLI that consumes the Bluesky firehose and sends it to a downstream destination.

## Destinations

- Tinybird
- Kafka
- ClickHouse
- Timeplus

## Usage

You can use `npx` (or `pnpm dlx`) to run the CLI without installing it.

Or use `npm install -g @sdairs/bluebird` to install it globally.

### Tinybird

```
npx @sdairs/bluebird start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```

### Kafka

```
npx @sdairs/bluebird start kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512 --batch-size 819200
```

### ClickHouse

```
npx @sdairs/bluebird start clickhouse --url http://localhost:8123 --database default --table bluebird
```

### Timeplus

You can create a free account at https://us-west-2.timeplus.cloud, then follow the guide to create the API token: https://docs.timeplus.com/apikey. The `stream` will be created automatically if not exists. This also works with self-hosting Timeplus Enterprise, please set the token as `username:password`.

```
npx @sdairs/bluebird start timeplus --token XXX --endpoint https://us-west-2.timeplus.cloud/ws_id --stream bluebird
```

## CLI development

The CLI is built with [oclif](https://oclif.io).

### Writing a new destination

Add a new directory under `src/destinations`, e.g., `src/destinations/my_destination`.

Create your destination class, e.g., `src/destinations/my_destination/my_destination.ts`. This must export a class that extends `Destination` from `src/destinations/base.ts`.

There are two methods you can override, `init` and `send`.

- `init`: **optional** - called once when the destination is first created
- `send`: **required** - called every time a batch is ready to be processed. This is where you should handle sending events to the downstream destination.


Here's the template to start from:

```
import { Destination } from '../base.js';
import { Event } from '../../lib/types.js';

interface MyDestinationConfig {
  token: string;
  endpoint: string;
  stream: string;
}

export class MyDestination extends Destination {
  private config: MyDestinationConfig;

  constructor(config: MyDestinationConfig) {
    super();
    this.config = config;
  }

  async init(): Promise<void> {

  }

  async send(events: Event[]): Promise<void> {

  }
}
```

### Adding the destination to the CLI start command

Add the new destination as a subcommandto the `start` topic. Create a new file in `src/commands/start/` named after your destination, e.g., `src/commands/start/my_destination.ts`.

Here's the template to start from:

```
import { Flags } from '@oclif/core';
import { BaseStartCommand } from './base.js';
import { MyDestination } from '../../destinations/my_destination/my_destination.js';
import { Destination } from '../../destinations/base.js';

export default class StartMyDestination extends BaseStartCommand<typeof StartMyDestination> {
  static description = 'Send the Bluebird feed to My Destination';

  static examples = [
    '<%= config.bin %> <%= command.id %> --some-config XXX',
  ];

  static flags = {
    someConfig: Flags.string({
      description: 'Some flag',
      char: 'c',
      required: true,
    }),
  };

  protected createDestination(flags: Record<string, any>): Destination {
    return new MyDestination({
      someConfig: flags.someConfig
    });
  }
}
```

### Building the CLI for dev

Install deps and build the CLI:

```
pnpm install
pnpm build
```

### Running the CLI for dev

From within the `cli` directory:

```
./bin/dev.js start [OPTS]
```

For example:

```
./bin/dev.js start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```

Note: you need to do this inside the `cli` dir if you don't have `ts-node` installed globally. If you see a module not found error for `ts-node`, this is why.

## Contributing

Just submit a PR - all contributions are welcome!
