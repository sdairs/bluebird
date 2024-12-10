import { Flags } from '@oclif/core';
import { BaseStartCommand } from './base.js';
import { TimeplusDestination } from '../../destinations/timeplus/timeplus.js';
export default class StartTimeplus extends BaseStartCommand {
    static description = 'Start the timeplus feed';
    static examples = [
        '<%= config.bin %> <%= command.id %> timeplus --stream bluebird_feed --token XXX --endpoint https://us-west-2.timeplus.cloud/myworkspace',
    ];
    static flags = {
        stream: Flags.string({
            description: 'Timeplus stream',
            required: true,
        }),
        token: Flags.string({
            description: 'Timeplus token',
            required: true,
        }),
        endpoint: Flags.string({
            description: 'Timeplus endpoint',
            required: true,
        }),
    };
    createDestination(flags) {
        return new TimeplusDestination({
            token: flags.token,
            endpoint: flags.endpoint,
            stream: flags.stream,
        });
    }
}
