/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { resolveConfig } = require('./sf-config');
const { semverIsLessThan } = require('./semver');

const PackageJson = require('./package-json');

function usesJsBinScripts(packageRoot) {
  return existsSync(join(packageRoot, 'bin', 'dev.js'));
}

module.exports = (packageRoot = require('./package-path')) => {
  const options = {
    jsBinScripts: usesJsBinScripts(packageRoot),
  };
  const config = resolveConfig(packageRoot, options);
  const pjson = new PackageJson(packageRoot);

  const license = pjson.get('license');
  if (license !== (config.license || 'BSD-3-Clause')) {
    pjson.contents.license = 'BSD-3-Clause';
    pjson.actions.push(`updating license`);
  }

  // GENERATE SCRIPTS
  const scriptList = Object.entries(config.scripts);
  const wireitList = Object.entries(config.wireit);

  if (scriptList.length > 0) {
    const scriptsChanged = [];

    const scripts = pjson.get('scripts');
    // eslint-disable-next-line prefer-const
    for (let [scriptName, scriptCommand] of scriptList) {
      if (scripts[scriptName] !== scriptCommand) {
        scripts[scriptName] = scriptCommand;
        scriptsChanged.push(scriptName);
      }
    }
    pjson.actions.push(`standardizing scripts: ${scriptsChanged.join(', ')}`);
    if (wireitList.length > 0) {
      const wireit = pjson.get('wireit');
      for (const [scriptName, scriptCommand] of wireitList) {
        if (wireit[scriptName] !== scriptCommand) {
          wireit[scriptName] = scriptCommand;
          scriptsChanged.push(scriptName);
        }
      }
    }
  }

  try {
    const tsconfig = readFileSync(join(packageRoot, 'tsconfig.json')).toString();
    const engineVersion = '>=16.0.0';
    // Don't control for non dev-config projects, or projects that don't specify an engine already.
    if (
      tsconfig.match(/"extends"\s*:\s*".*@salesforce\/dev-config/) &&
      pjson.contents.engines &&
      pjson.contents.engines.node &&
      pjson.contents.engines.node !== engineVersion &&
      semverIsLessThan(pjson.contents.engines.node.replace('>=', ''), engineVersion.replace('>=', ''))
    ) {
      pjson.actions.push('updating node engine');
      pjson.contents.engines.node = engineVersion;
    }
  } catch (err) {
    // Don't control for non typescript projects.
  }

  pjson.write();
};
