import { Flags } from '@oclif/core';
import { BaseStartCommand } from './base.js';
import { TinybirdDestination } from '../../destinations/tinybird/tinybird.js';
export default class StartTinybird extends BaseStartCommand {
    static description = 'Send the Bluebird feed to Tinybird';
    static examples = [
        '<%= config.bin %> <%= command.id %> --token e.XXX --endpoint https://api.tinybird.co --datasource bluebird_feed',
    ];
    static flags = {
        token: Flags.string({
            description: 'Tinybird Token',
            char: 't',
            required: true,
        }),
        endpoint: Flags.string({
            description: 'Tinybird API base URL',
            char: 'e',
            required: true,
        }),
        datasource: Flags.string({
            description: 'Tinybird Data Source',
            char: 'd',
            required: true,
        }),
    };
    createDestination(flags) {
        return new TinybirdDestination({
            token: flags.token,
            endpoint: flags.endpoint,
            datasource: flags.datasource,
        });
    }
}
