#!/usr/bin/env node
const minimist = require('minimist');
const { error } = require('@dima-toolbox/logger');

main();

function main() {
  const argv = minimist(process.argv.slice(2));
  const pluginName: pluginName = argv._[0];
  const plugin = getPlugin(pluginName);

  const optionInfo: any = {};
  Object.keys(argv).forEach((argKey: string) => {
    if (argKey !== '_') {
      optionInfo[argKey] = argv[argKey];
    }
  });
  plugin({ ...optionInfo, pluginName });
}

function getPlugin(pluginName: pluginName): Function {
  if (!pluginName) {
    process.exit(1);
  }
  try {
    return require(`@dima-toolbox/${pluginName}`);
  } catch (err: any) {
    error(err.message);
    process.exit(1);
  }
}
