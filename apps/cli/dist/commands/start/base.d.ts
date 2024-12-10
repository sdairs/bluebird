import { Command, Interfaces } from '@oclif/core';
import { Destination } from '../../destinations/base.js';
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseStartCommand['baseFlags'] & T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;
export declare abstract class BaseStartCommand<T extends typeof Command> extends Command {
    static description: string;
    static baseFlags: {
        cursor: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
    };
    protected flags: Flags<T>;
    protected args: Args<T>;
    init(): Promise<void>;
    protected abstract createDestination(flags: Record<string, any>): Destination;
    run(): Promise<void>;
    protected catch(err: Error & {
        exitCode?: number;
    }): Promise<any>;
    protected finally(_: Error | undefined): Promise<any>;
}
