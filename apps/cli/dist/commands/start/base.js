import { Command, Flags } from '@oclif/core';
import { JetstreamHandler } from '../../lib/jetstream.js';
export class BaseStartCommand extends Command {
    static description = 'Start the bluebird feed';
    static baseFlags = {
        cursor: Flags.string({
            description: 'Cursor (Unix microseconds)',
            required: false,
            char: 'c',
        }),
    };
    flags;
    args;
    async init() {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: super.ctor.baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags;
        this.args = args;
    }
    async run() {
        const { flags } = await this.parse(this.constructor);
        const destination = this.createDestination(flags);
        const handler = new JetstreamHandler(destination);
        // Handle graceful shutdown
        const cleanup = async () => {
            process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        await handler.start();
    }
    async catch(err) {
        // add any custom logic to handle errors from the command
        // or simply return the parent class error handling
        return super.catch(err);
    }
    async finally(_) {
        // called after run and catch regardless of whether or not the command errored
        return super.finally(_);
    }
}
