bluebird
=================

send bluesky firehose to tinybird


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bluebird.svg)](https://npmjs.org/package/bluebird)
[![Downloads/week](https://img.shields.io/npm/dw/bluebird.svg)](https://npmjs.org/package/bluebird)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bluebird-cli
$ bluebird COMMAND
running command...
$ bluebird (--version)
bluebird-cli/0.1.0 linux-x64 node-v18.20.5
$ bluebird --help [COMMAND]
USAGE
  $ bluebird COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bluebird help [COMMAND]`](#bluebird-help-command)
* [`bluebird plugins`](#bluebird-plugins)
* [`bluebird plugins add PLUGIN`](#bluebird-plugins-add-plugin)
* [`bluebird plugins:inspect PLUGIN...`](#bluebird-pluginsinspect-plugin)
* [`bluebird plugins install PLUGIN`](#bluebird-plugins-install-plugin)
* [`bluebird plugins link PATH`](#bluebird-plugins-link-path)
* [`bluebird plugins remove [PLUGIN]`](#bluebird-plugins-remove-plugin)
* [`bluebird plugins reset`](#bluebird-plugins-reset)
* [`bluebird plugins uninstall [PLUGIN]`](#bluebird-plugins-uninstall-plugin)
* [`bluebird plugins unlink [PLUGIN]`](#bluebird-plugins-unlink-plugin)
* [`bluebird plugins update`](#bluebird-plugins-update)

## `bluebird help [COMMAND]`

Display help for bluebird.

```
USAGE
  $ bluebird help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bluebird.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.17/src/commands/help.ts)_

## `bluebird plugins`

List installed plugins.

```
USAGE
  $ bluebird plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bluebird plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/index.ts)_

## `bluebird plugins add PLUGIN`

Installs a plugin into bluebird.

```
USAGE
  $ bluebird plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into bluebird.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BLUEBIRD_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BLUEBIRD_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ bluebird plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ bluebird plugins add myplugin

  Install a plugin from a github url.

    $ bluebird plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ bluebird plugins add someuser/someplugin
```

## `bluebird plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bluebird plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bluebird plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/inspect.ts)_

## `bluebird plugins install PLUGIN`

Installs a plugin into bluebird.

```
USAGE
  $ bluebird plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into bluebird.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BLUEBIRD_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BLUEBIRD_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ bluebird plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ bluebird plugins install myplugin

  Install a plugin from a github url.

    $ bluebird plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ bluebird plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/install.ts)_

## `bluebird plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ bluebird plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ bluebird plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/link.ts)_

## `bluebird plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bluebird plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bluebird plugins unlink
  $ bluebird plugins remove

EXAMPLES
  $ bluebird plugins remove myplugin
```

## `bluebird plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ bluebird plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/reset.ts)_

## `bluebird plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bluebird plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bluebird plugins unlink
  $ bluebird plugins remove

EXAMPLES
  $ bluebird plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/uninstall.ts)_

## `bluebird plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bluebird plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bluebird plugins unlink
  $ bluebird plugins remove

EXAMPLES
  $ bluebird plugins unlink myplugin
```

## `bluebird plugins update`

Update installed plugins.

```
USAGE
  $ bluebird plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/update.ts)_
<!-- commandsstop -->
