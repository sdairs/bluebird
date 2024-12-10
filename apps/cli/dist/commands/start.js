import { Command } from '@oclif/core';
export default class Start extends Command {
    static args = {};
    static description = 'Start the bluebird feed';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];
    static flags = {};
    async run() {
        const { args, flags } = await this.parse(Start);
        const name = flags.name ?? 'world';
        this.log(`hello ${name} from /Users/ab/Documents/bluebird/apps/cli/src/commands/start.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
