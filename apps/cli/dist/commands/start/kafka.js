import { Flags } from '@oclif/core';
import { BaseStartCommand } from './base.js';
import { KafkaDestination } from '../../destinations/kafka/kafka.js';
export default class StartKafka extends BaseStartCommand {
    static description = 'Send the Bluebird feed to Kafka';
    static examples = [
        '<%= config.bin %> <%= command.id %> --brokers localhost:9092 --topic bluebird',
        '<%= config.bin %> <%= command.id %> --brokers broker:9092 --topic bluebird --username user --password pass --sasl-mechanism scram-sha-512',
        '<%= config.bin %> <%= command.id %> --brokers broker:9092 --topic bluebird --batch-size 2097152',
    ];
    static flags = {
        brokers: Flags.string({
            description: 'Kafka brokers (comma-separated)',
            char: 'b',
            required: true,
        }),
        topic: Flags.string({
            description: 'Kafka topic',
            char: 't',
            required: true,
        }),
        'client-id': Flags.string({
            description: 'Kafka client ID',
            char: 'c',
            default: 'bluebird-producer',
        }),
        username: Flags.string({
            description: 'SASL username',
            char: 'u',
            dependsOn: ['password'],
        }),
        password: Flags.string({
            description: 'SASL password',
            char: 'p',
            dependsOn: ['username'],
        }),
        'sasl-mechanism': Flags.string({
            description: 'SASL mechanism',
            options: ['plain', 'scram-sha-256', 'scram-sha-512'],
            default: 'plain',
            char: 'm',
            dependsOn: ['username', 'password'],
        }),
        'batch-size': Flags.integer({
            description: 'Maximum batch size in bytes',
            default: 900 * 1024, // 900KB
            char: 'n'
        }),
        ssl: Flags.boolean({
            description: 'Enable SSL',
            char: 's',
            default: true,
        }),
    };
    createDestination(flags) {
        const config = {
            brokers: flags.brokers.split(','),
            clientId: flags['client-id'],
            sasl: {
                mechanism: flags['sasl-mechanism'].toLowerCase(),
                username: flags.username,
                password: flags.password,
            },
            ssl: flags.ssl,
        };
        return new KafkaDestination(config, flags.topic);
    }
}
