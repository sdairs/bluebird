# Bluebird

Bluebird is a CLI that consumes the BlueSky firehose and sends it to a downstream destination.

## Destinations

- Tinybird
- Kafka

## Usage

For Tinybird:

```
bluebird start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```

For Kafka:

```
bluebird start kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512 --batch-size 819200
```

For ClickHouse:

```
bluebird start clickhouse --url http://localhost:8123 --database default --table bluebird
```