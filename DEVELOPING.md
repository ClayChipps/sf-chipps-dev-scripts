# Developing

## Pre-requisites

1. We use the active NodeJS LTS. If you need to work with multiple versions of Node, you
   might consider using [nvm](https://github.com/creationix/nvm).
1. This repository uses [yarn](https://yarnpkg.com/) to manage node dependencies. Please install yarn globally using `npm install --global yarn`.
1. Tests are executed on the latest NodeJS as well as all active and maintained NodeJS LTS versions.

## Structure

## Typical workflow

You would only do this once after you cloned the repository.

1. Clone this repository from git.
1. `cd` into `sf-chipps-dev-scripts`.
1. We develop using feature branches off `main` and release from the `main` branch. At
   this point, it should be set to `main` by default. If not, run `git checkout -t origin/main`.
1. `yarn` to bring in all the top-level dependencies and bootstrap.
1. Open the project in your editor of choice.

## When you are ready to commit

1. We enforce commit message format. We recommend using [commitizen](https://github.com/commitizen/cz-cli) by installing it with `yarn global add commitizen` then commit using `git cz` which will prompt you questions to format the commit message.
1. Before commit and push, husky will run several hooks to ensure the message and that everything lints and compiles properly.

## List of Useful commands

These commands assume that they are executed from the top-level directory.

### `yarn compile`

This runs `yarn compile` on each of the package in packages.

### `yarn clean`

This run `yarn clean` on each of the package in packages. Running `yarn clean-all` will also clean up the node_module directories.

### `yarn test`

This runs `yarn test` on each of the packages.

### `yarn lint`

This runs `yarn lint` on each of the packages.
