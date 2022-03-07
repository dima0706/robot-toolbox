#!/usr/bin/env node
import minimist from 'minimist';
import { error } from '@robot-toolbox/logger';

main();

async function main() {
  const argv = minimist(process.argv.slice(2));
  const pluginName: pluginName = argv._[0];
  const plugin = getPlugin(pluginName);

  const optionInfo: any = {};
  Object.keys(argv).forEach((argKey: string) => {
    if (argKey !== '_') {
      optionInfo[argKey] = argv[argKey];
    }
  });
  try {
    await plugin({ ...optionInfo, pluginName });
  } catch (err: any) {
    error(err.message);
    process.exit(1);
  }
}

function getPlugin(pluginName: pluginName): Function {
  try {
    if (!pluginName) {
      throw new Error('请调用指定的工具包');
    }
    return require(`@robot-toolbox/${pluginName}`);
  } catch (err: any) {
    error(err.message);
    process.exit(1);
  }
}
