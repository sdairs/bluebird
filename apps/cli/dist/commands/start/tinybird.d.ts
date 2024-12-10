import { BaseStartCommand } from './base.js';
import { Destination } from '../../destinations/base.js';
export default class StartTinybird extends BaseStartCommand<typeof StartTinybird> {
    static description: string;
    static examples: string[];
    static flags: {
        token: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        endpoint: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        datasource: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    protected createDestination(flags: Record<string, any>): Destination;
}
