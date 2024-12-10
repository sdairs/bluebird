import { Command, Flags, Interfaces } from '@oclif/core';
import { JetstreamHandler } from '../../lib/jetstream.js';
import { Destination } from '../../destinations/base.js';

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseStartCommand['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseStartCommand<T extends typeof Command> extends Command {
  static description = 'Start the bluebird feed';

  static baseFlags = {
    cursor: Flags.string({
      description: 'Cursor (Unix microseconds)',
      required: false,
      char: 'c',
    }),
  };

  protected flags!: Flags<T>
  protected args!: Args<T>

  public async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseStartCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  protected abstract createDestination(flags: Record<string, any>): Destination;

  async run(): Promise<void> {
    const { flags } = await this.parse(this.constructor as typeof BaseStartCommand);
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

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
