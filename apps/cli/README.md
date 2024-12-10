@sdairs/bluebird
=================

Send the Bluesky firehose to various data services


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@sdairs/bluebird.svg)](https://npmjs.org/package/@sdairs/bluebird)
[![Downloads/week](https://img.shields.io/npm/dw/@sdairs/bluebird.svg)](https://npmjs.org/package/@sdairs/bluebird)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @sdairs/bluebird
$ bluebird COMMAND
running command...
$ bluebird (--version)
@sdairs/bluebird/1.0.0 darwin-arm64 node-v22.11.0
$ bluebird --help [COMMAND]
USAGE
  $ bluebird COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bluebird start`](#bluebird-start)
* [`bluebird start base`](#bluebird-start-base)
* [`bluebird start clickhouse`](#bluebird-start-clickhouse)
* [`bluebird start kafka`](#bluebird-start-kafka)
* [`bluebird start timeplus`](#bluebird-start-timeplus)
* [`bluebird start tinybird`](#bluebird-start-tinybird)

## `bluebird start`

Start the bluebird feed

```
USAGE
  $ bluebird start

DESCRIPTION
  Start the bluebird feed

EXAMPLES
  $ bluebird start
```

## `bluebird start base`

Start the bluebird feed

```
USAGE
  $ bluebird start base [-c <value>]

FLAGS
  -c, --cursor=<value>  Cursor (Unix microseconds)

DESCRIPTION
  Start the bluebird feed
```

## `bluebird start clickhouse`

Start the bluebird feed with ClickHouse destination

```
USAGE
  $ bluebird start clickhouse --table <value> [-c <value>] [--url <value>] [--database <value>] [--username <value>]
    [--password <value>]

FLAGS
  -c, --cursor=<value>    Cursor (Unix microseconds)
      --database=<value>  ClickHouse database name
      --password=<value>  ClickHouse password
      --table=<value>     (required) ClickHouse table name
      --url=<value>       ClickHouse server URL
      --username=<value>  ClickHouse username

DESCRIPTION
  Start the bluebird feed with ClickHouse destination

EXAMPLES
  $ bluebird start clickhouse --url http://localhost:8123 --database default --table bluebird
```

## `bluebird start kafka`

Send the Bluebird feed to Kafka

```
USAGE
  $ bluebird start kafka -b <value> -t <value> [-c <value>] [-c <value>] [-m plain|scram-sha-256|scram-sha-512
    [-u <value> -p <value>] ] [-n <value>] [-s]

FLAGS
  -b, --brokers=<value>          (required) Kafka brokers (comma-separated)
  -c, --client-id=<value>        [default: bluebird-producer] Kafka client ID
  -c, --cursor=<value>           Cursor (Unix microseconds)
  -m, --sasl-mechanism=<option>  [default: plain] SASL mechanism
                                 <options: plain|scram-sha-256|scram-sha-512>
  -n, --batch-size=<value>       [default: 921600] Maximum batch size in bytes
  -p, --password=<value>         SASL password
  -s, --ssl                      Enable SSL
  -t, --topic=<value>            (required) Kafka topic
  -u, --username=<value>         SASL username

DESCRIPTION
  Send the Bluebird feed to Kafka

EXAMPLES
  $ bluebird start kafka --brokers localhost:9092 --topic bluebird

  $ bluebird start kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512

  $ bluebird start kafka --brokers broker:9092 --topic bluebird --batch-size 2097152
```

## `bluebird start timeplus`

Start the timeplus feed

```
USAGE
  $ bluebird start timeplus --stream <value> --token <value> --endpoint <value> [-c <value>]

FLAGS
  -c, --cursor=<value>    Cursor (Unix microseconds)
      --endpoint=<value>  (required) Timeplus endpoint
      --stream=<value>    (required) Timeplus stream
      --token=<value>     (required) Timeplus token

DESCRIPTION
  Start the timeplus feed

EXAMPLES
  $ bluebird start timeplus timeplus --stream bluebird_feed --token XXX --endpoint https://us-west-2.timeplus.cloud/myworkspace
```

## `bluebird start tinybird`

Send the Bluebird feed to Tinybird

```
USAGE
  $ bluebird start tinybird -t <value> -e <value> -d <value> [-c <value>]

FLAGS
  -c, --cursor=<value>      Cursor (Unix microseconds)
  -d, --datasource=<value>  (required) Tinybird Data Source
  -e, --endpoint=<value>    (required) Tinybird API base URL
  -t, --token=<value>       (required) Tinybird Token

DESCRIPTION
  Send the Bluebird feed to Tinybird

EXAMPLES
  $ bluebird start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```
<!-- commandsstop -->
