import { BaseStartCommand } from './base.js';
import { Destination } from '../../destinations/base.js';
export default class StartKafka extends BaseStartCommand<typeof StartKafka> {
    static description: string;
    static examples: string[];
    static flags: {
        brokers: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        topic: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        'client-id': import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        username: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        password: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        'sasl-mechanism': import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        'batch-size': import("@oclif/core/lib/interfaces/parser.js").OptionFlag<number, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        ssl: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    protected createDestination(flags: Record<string, any>): Destination;
}
