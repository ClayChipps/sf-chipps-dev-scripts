/*
 * Copyright (c) 2024, Clay Chipps; Copyright (c) 2024, Salesforce.com, Inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const packagePath = require('../utils/package-path');
const shell = require('./shelljs');

// This should be in each package's `prepare` script but we already use it to run `sf-install`.
shell.exec('pnpm husky install');

function initializeHusky() {
  try {
    const localGitHooks = fs
      .readdirSync(path.normalize(`${packagePath}${path.sep}.husky`))
      .filter((hook) => hook !== '_');

    if (localGitHooks.length === 0) {
      shell.exec("pnpm husky add .husky/commit-msg 'pnpm commitlint --edit'");
      shell.exec("pnpm husky add .husky/pre-commit 'pnpm lint && pnpm pretty-quick --staged'");
      shell.exec("pnpm husky add .husky/pre-push 'pnpm build && pnpm run test:only -- --forbid-only'");
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      const errorHeader = chalk.red('ERROR: ');
      const errorMsg = ".husky folder wasn't found, try running `pnpm husky install` to finish the install";
      // eslint-disable-next-line no-console
      console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
      process.exit(1);
    }
    throw err;
  }
}

module.exports = initializeHusky;
