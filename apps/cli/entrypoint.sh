#!/bin/bash

bluebird_cmd="bluebird"
DESTINATION="${DESTINATION:-}"

# avoid the partitioner warning
export KAFKAJS_NO_PARTITIONER_WARNING=1

# Default values for general environment variables
CURSOR="${CURSOR:-}"

# Default values for Clickhouse-related environment variables
CLICKHOUSE_URL="${CLICKHOUSE_URL:-http://localhost:8123}"
CLICKHOUSE_TABLE="${CLICKHOUSE_TABLE:-}"
CLICKHOUSE_DATABASE="${CLICKHOUSE_DATABASE:-}"
CLICKHOUSE_USERNAME="${CLICKHOUSE_USERNAME:-}"
CLICKHOUSE_PASSWORD="${CLICKHOUSE_PASSWORD:-}"

# Default values for Kafka-related environment variables
KAFKA_BROKERS="${KAFKA_BROKERS:-localhost:9092}"
KAFKA_TOPIC="${KAFKA_TOPIC:-}"
KAFKA_SASL_MECHANISM="${KAFKA_SASL_MECHANISM:-}"
KAFKA_BATCH_SIZE="${KAFKA_BATCH_SIZE:-}"
KAFKA_CLIENT_ID="${KAFKA_CLIENT_ID:-bluebird-producer}"
KAFKA_SSL="${KAFKA_SSL:-false}"
KAFKA_USERNAME="${KAFKA_USERNAME:-}"
KAFKA_PASSWORD="${KAFKA_PASSWORD:-}"

# Default values for Timeplus-related environment variables
TIMEPLUS_STREAM="${TIMEPLUS_STREAM:-}"
TIMEPLUS_TOKEN="${TIMEPLUS_TOKEN:-}"
TIMEPLUS_ENDPOINT="${TIMEPLUS_ENDPOINT:-}"

# Default values for Tinybird-related environment variables
TINYBIRD_DATASOURCE="${TINYBIRD_DATASOURCE:-}"
TINYBIRD_ENDPOINT="${TINYBIRD_ENDPOINT:-}"
TINYBIRD_TOKEN="${TINYBIRD_TOKEN:-}"

# Default command
case "${DESTINATION,,}" in  # Convert DESTINATION to lowercase
    "clickhouse")
        bluebird_cmd="$bluebird_cmd start clickhouse --url=${CLICKHOUSE_URL} --table=${CLICKHOUSE_TABLE}"

        if [ -n "$CLICKHOUSE_DATABASE" ]; then
            bluebird_cmd="$bluebird_cmd --database=${CLICKHOUSE_DATABASE}"
        fi
        if [ -n "$CLICKHOUSE_USERNAME" ]; then
            bluebird_cmd="$bluebird_cmd --username=${CLICKHOUSE_USERNAME} --password=${CLICKHOUSE_PASSWORD}"
        fi        
        ;;
    "kafka")

        bluebird_cmd="$bluebird_cmd start kafka --brokers=${KAFKA_BROKERS} --topic=${KAFKA_TOPIC}"

        if [ -n "$KAFKA_SASL_MECHANISM" ]; then
            bluebird_cmd="$bluebird_cmd --sasl-mechanism=${KAFKA_SASL_MECHANISM} --username=${KAFKA_USERNAME} --password=${KAFKA_PASSWORD}"
        fi

        if [ -n "$CLIENT_ID" ]; then
            bluebird_cmd="$bluebird_cmd --sasl-mechanism=${CLIENT_ID}"
        fi

        if [ -n "$BATCH_SIZE" ]; then
            bluebird_cmd="$bluebird_cmd --batch-size=${BATCH_SIZE}"
        fi

        if [ "${KAFKA_SSL,,}" = "true" ]; then
            bluebird_cmd="$bluebird_cmd --ssl"
        fi
        ;;
    "timeplus")
        bluebird_cmd="$bluebird_cmd start timeplus --stream=${TIMEPLUS_STREAM} --token=${TIMEPLUS_TOKEN} --endpoint=${TIMEPLUS_ENDPOINT}"

        ;;
    "tinybird")
        bluebird_cmd="$bluebird_cmd start tinybird --token=${TINYBIRD_TOKEN} --endpoint=${TINYBIRD_ENDPOINT} --datasource=${TINYBIRD_DATASOURCE}"

        ;;
    *)
        bluebird_cmd="bluebird"
        ;;
    esac

if [ -n "$CURSOR" ]; then
    bluebird_cmd="$bluebird_cmd --cursor=${CURSOR}"
fi

# Execute the bluebird command with the provided flags
exec $bluebird_cmd "$@"
