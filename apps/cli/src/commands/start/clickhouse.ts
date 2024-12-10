import { Flags } from '@oclif/core';
import { BaseStartCommand } from './base.js';
import { ClickHouseDestination } from '../../destinations/clickhouse/clickhouse.js';
import { Destination } from '../../destinations/base.js';

export default class StartClickhouse extends BaseStartCommand<typeof StartClickhouse> {
  static description = 'Start the bluebird feed with ClickHouse destination';

  static examples = [
    '<%= config.bin %> <%= command.id %> --url http://localhost:8123 --database default --table bluebird',
  ];

  static flags = {
    url: Flags.string({
      description: 'ClickHouse server URL',
      required: false,
    }),
    database: Flags.string({
      description: 'ClickHouse database name',
      required: false,
    }),
    username: Flags.string({
      description: 'ClickHouse username',
      required: false,
    }),
    password: Flags.string({
      description: 'ClickHouse password',
      required: false,
    }),
    table: Flags.string({
      description: 'ClickHouse table name',
      required: true,
    }),
  };

  protected createDestination(flags: Record<string, any>): Destination {
    return new ClickHouseDestination({
      url: flags.url,
      database: flags.database,
      username: flags.username,
      password: flags.password,
    }, flags.table);
  }
}
