import {Args, Command, Flags} from '@oclif/core'

export default class Start extends Command {
  static override args = {}

  static override description = 'Start the bluebird feed'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {}

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Start)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/ab/Documents/bluebird/apps/cli/src/commands/start.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
