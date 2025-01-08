# Bluebird Docker Image

Wih the bluebird docker image `ghcr.io/sdairs/bluebird:latest` you can use the CLI without any installation. 

You can either use the command line style with parameters or environment variables to control the behavior.

## Command Line Style Usage

Just pass the `start <destination>` with the available parameters (flags) for the destination you wish to use as the command to the docker container. 

For example to use Tinybird, you would use

```bash
docker run --rm ghcr.io/sdairs/bluebird:latest start tinybird --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed
```

or for Kafka, you would use

```bash
docker run --rm ghcr.io/sdairs/bluebird:latest start kafka --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512 --batch-size 819200
```

## Environment Variable Style Usage

With this option, the destination is specified by setting the `DESTINATION` environment variable and the parameters are specified using the destination specific environment variables. 

For example to use Tinybird, you would use

```bash
docker run --rm -e DESTINATION=tinybird  -e TINYBIRD_TOKEN=e.XXX -e TINYBIRD_ENDPOINT=https://api.tinybird.co -e TINYBIRD_DATASOURCE=bluebird_feed ghcr.io/sdairs/bluebird:latest
```

For Kafka, you would use

```bash
docker run --rm -e DESTINATION=kafka -e KAFKA_BROKERS=broker:9092 -e KAFKA_TOPIC=bluebird -e KAFKA_SASL_MECHANISM=scram-sha-512 -e KAFKA_USERNAME=user -e KAFKA_PASSWORD=pass trivadis/bluebird:latest
```

The following environment variables are supported

**Global**

* `DESTINATION` - (required) specifies the destination to use, either `tinybird`, `clickhouse`, `kafka` or `timeplus` 
* `CURSOR` - maps to `--cursor` 

**Tinybird specific**

* `TINYBIRD_ENDPOINT` - (required) maps to `--endpoint`
* `TINYBIRD_TOKEN` - (required) maps to `--token`
* `TINYBIRD_DATASOURCE` - (required) maps to `--datasource`

**Kafka specific**

* `KAFKA_BROKERS` - (required) maps to `--brokers`
* `KAFKA_TOPIC` - (required) maps to `--topic`
* `KAFKA_SASL_MECHANISM` - maps to `--sasl-mechanism`
* `KAFKA_BATCH_SIZE`  - maps to `--batch-size`
* `KAFKA_CLIENT_ID` - maps to `--client-id`
* `KAFKA_SSL` - if `true` then maps to `--ssl`
* `KAFKA_USERNAME`  - maps to `--username`
* `KAFKA_PASSWORD`  - maps to `--password`

**Clickhouse specific**

* `CLICKHOUSE_URL` - maps to `--url`
* `CLICKHOUSE_TABLE` - (required) maps to `--table`
* `CLICKHOUSE_DATABASE` - maps to `--database`
* `CLICKHOUSE_USERNAME`  - maps to `--username`
* `CLICKHOUSE_PASSWORD` - maps to `--password`


**Timeplus specific**

* `TIMEPLUS_ENDPOINT`  - (required) maps to `--endpoint`
* `TIMEPLUS_STREAM` - (required) maps to `--stream`
* `TIMEPLUS_TOKEN` - (required) maps to `--token`

## Docker Compose Usage

The environment variable style allows to easily run bluebird as part of a docker compose stack.

For example to easily start Kafka, AKHQ and have bluebird sending messages to kafka, you could use the following `docker-compose.yml`. 

```yaml
services:
  kafka:
    image: bitnami/kafka:3.7
    container_name: kafka
    ports:
      - "9092:9092"
      - "9094:9094"
    environment:
      - KAFKA_ENABLE_KRAFT=yes
      - KAFKA_KRAFT_CLUSTER_ID=228f04bc-0895-11ee-be56-0242ac120002
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092,EXTERNAL://kafka:9094
      - KAFKA_BROKER_ID=1
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@127.0.0.1:9093
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_AUTO_CREATE_TOPICS_ENABLE=true
      - KAFKA_CFG_NUM_PARTITIONS=2
    healthcheck:
      test: ["CMD-SHELL", "kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --list"]
      interval: 2s
      timeout: 2s
      retries: 15

  akhq:
    image: tchiotludo/akhq:latest
    container_name: akhq
    ports:
      - "8080:8080"
    environment:
      AKHQ_CONFIGURATION: |
        akhq:
          connections:
            kafka:
              properties:
                bootstrap.servers: "kafka:9094"
    depends_on:
      kafka:
        condition: service_healthy
        
  bluebird:
    image: trivadis/bluebird:latest
    container_name: bluebird
    environment:
      DESTINATION: kafka
      KAFKA_BROKERS: kafka:9094
      KAFKA_TOPIC: bluebird
    depends_on:
      kafka:
        condition: service_healthy
```

Start it using `docker compose up -d` and wait until everthing is up and running. 

Now you can use 
 * AKHQ to browse the `bluebird` topic by navigating to <http://localhost:8080> or 
 * use the Kafka console consumer by executing `docker exec -ti kafka kafka-console-consumer.sh --bootstrap-server kafka:9094 --topic bluebird`