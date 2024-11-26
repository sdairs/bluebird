# Bluebird

Bluebird is a CLI that consumes the BlueSky firehose and sends it to a downstream destination.

## Destinations

- Tinybird
- Kafka

## Usage

For Tinybird:

```
bluebird start --tinybird-token e.XXX --tinybird-endpoint https://api.tinybird.co --tinybird-datasource bluebird_feed
```

For Kafka:

```
bluebird start --kafka-brokers broker:9092 --kafka-topic bluebird --kafka-username user --kafka-password pass --kafka-sasl-mechanism scram-sha-512 --kafka-batch-size 819200
```