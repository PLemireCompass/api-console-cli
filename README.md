# API console CLI

The command-line tool for the API Console Web Component.

![Warning][warning] ![Warning][warning] ![Warning][warning] ![Warning][warning]

Note: __This version does not work with API console version 4__.

This CLI tool works with version 5 which is still in preview.

Please, use version [0.2.12](https://github.com/mulesoft-labs/api-console-cli/tree/0.2.x).

```
$ npm install -g api-console-cli@0.2.12
```

![Warning][warning] ![Warning][warning] ![Warning][warning] ![Warning][warning]

## Features

-   __build__ - Build the api console application optimized for production
-   __generate-json__ - Regenerates the JSON file that can be used as a data source in the Console
-   __serve__ - Creates a http server on local machine and serves content of current folder.

## Installation

```
$ npm install -g api-console-cli
```

## Command Overview

### General options

#### `api-console [COMMAND] --help`

Run `api-console --help` to get a list of supported commands. Pass it a command name (ex: `api-console build --help`) to get detailed information about that command and the options it supports.

#### `api-console [COMMAND] [--options] --no-ga`

Disables Google Analytics and asking to enable Google Analytics. Should be used in automated environment. The library detects most common CI environments.

## Commands

### `api-console build [options] -a path/to/api.raml -t "RAML 1.0"`

__NOTE__ until API console version 5 is in preview add `-n "5.0.0-preview-1"` to the command to install preview version.

Builds the API Console for specific API definition. The build is optimized for production, meaning code bundling and minification.

By default this tool support RAML and OAS.

Run `api-console build --help` for the full list of available options & optimizations.

Detailed description of all options you can find here: [api-console build doc](docs/api-console-build.md)

### `api-console generate-json <RAML PATH> [options]`

Creates a JSON file from the RAML spec that can be used as a data source for the API Console.

One of the optimization options it to create a JSON file instead of parsing YAML in the browser. This command allows you to create / regenerate this JSON file instead of rebuilding the whole console.

Run `api-console generate-json --help` for the full list of available options & optimizations.

Detailed description of all options you can find here: [api-console generate-json doc](docs/api-console-generate-json.md)

### `api-console serve [options] [path]`

Runs a local web server serving a content of the current directory or selected path.

Detailed description of all options you can find here: [api-console serve doc](docs/api-console-serve.md)

## Contribution

Your feedback is welcome. If you need support for a method, command options other than described here please, file a feature request. If you find a bug, please, file a bug report with details so we can fix it.

[warning]: docs/warning-icon.png "Warning"

## Google Analytics tracking

This CLI tool will ask you if you allow to send anonymous data to Google Analytics. This allows us to see how the tool is used and improve your experience in the future (by, for example, providing better default options).
None of your data are sent to the analytics server. You can check collected data in source files.

You can always say no when asked to share the data or pass `--no-ga` argument when executing the command. The tool detects CI environment and skips any GA questions or tracking. If the build fails due the question pass the `--no-ga` option.
