# Bluebird

Bluebird is a CLI that consumes the BlueSky firehose and sends it to a downstream destination.

## Destinations

- Tinybird
- Kafka
- ClickHouse

## Usage

You can use `npx` (or `pnpm dlx`) to run the CLI without installing it.

Or use `npm install -g @sdairs/bluebird` to install it globally.

For Tinybird:

```
npx @sdairs/bluebird start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```

For Kafka:

```
npx @sdairs/bluebird start kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512 --batch-size 819200
```

For ClickHouse:

```
npx @sdairs/bluebird start clickhouse --url http://localhost:8123 --database default --table bluebird
```

## CLI development

The CLI is built with [oclif](https://oclif.io).

### Writing a new destination

Add a new directory under `src/destinations`, e.g., `src/destinations/my_destination`.

Create your destination class, e.g., `src/destinations/my_destination/my_destination.js`. This must export a class that extends `Destination`.

There are two methods you can override, `initialize` and `processBatch`.

- `initialize`: **optional** - called once when the destination is first created
- `processBatch`: **required** - called every time a batch is ready to be processed. This is where you should handle sending events to the downstream destination.


Here's the template to start from:

```
import { Destination } from '../destination.js'

export class TinybirdDestination extends Destination {
  constructor() {
    super()
  }

  async processBatch(events) {

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

### Adding the destination to the CLI start command

Add the new destination to the `start` command in `src/commands/start/index.js`.

1. Add example usage in the examples array
2. Add your destination to the `args` object
3. Add any flags to the `flags` object
4. Add your destination to the destination switch in `run()`

## Contributing

Just submit a PR - all contributions are welcome!