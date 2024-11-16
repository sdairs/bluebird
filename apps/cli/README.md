bluebird
=================

send bluesky firehose to tinybird


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bluebird.svg)](https://npmjs.org/package/bluebird)
[![Downloads/week](https://img.shields.io/npm/dw/bluebird.svg)](https://npmjs.org/package/bluebird)


<!-- toc -->
- [bluebird](#bluebird)
- [Usage](#usage)
- [Commands](#commands)
  - [`bluebird start`](#bluebird-start)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bluebird
$ bluebird COMMAND
running command...
$ bluebird (--version)
bluebird/0.0.0 darwin-arm64 node-v20.17.0
$ bluebird --help [COMMAND]
USAGE
  $ bluebird COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [bluebird](#bluebird)
- [Usage](#usage)
- [Commands](#commands)
  - [`bluebird start`](#bluebird-start)

## `bluebird start`

start the firehose

```
USAGE
  $ bluebird start

FLAGS
  --tinybird_token=<value>  (required) Tinybird token
  --tinybird_endpoint=<value>  (required) Tinybird endpoint
  --tinybird_datasource=<value>  (required) Tinybird datasource

DESCRIPTION
  start the firehose

EXAMPLES
  $ bluebird start --tinybird_token=... --tinybird_endpoint=... --tinybird_datasource=...
```

_See code: [src/commands/start/index.ts](https://github.com/bsky_to_tinybird/bluebird/blob/v0.0.0/src/commands/start/index.ts)_
<!-- commandsstop -->
