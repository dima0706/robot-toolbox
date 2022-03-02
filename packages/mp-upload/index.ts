const { join, normalize } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { platform, homedir } = require('os');
const inquirer = require('inquirer');
const shelljs = require('shelljs');

export = async function mpUpload(params: MpUploadOptions) {
  const { bScript = 'build', distUrl = 'dist' } = params;
  const { cli, cliCwd } = getMiniprogramCli();

  if (!cli || !cliCwd) {
    throw new Error('cli获取失败');
  }

  const { needBuild, version } = await inquirer.prompt([
    { type: 'confirm', name: 'needBuild', message: '是否需要构建？' },
    { type: 'input', name: 'version', message: '请输入版本号' }
  ]);

  const isNaNVersion = version.split('.').some((numStr: number) => isNaN(numStr));
  if (isNaNVersion) {
    throw new Error(`版本号输入错误，例如：1.0.1`);
  }

  if (needBuild) {
    shelljs.exec(`yarn ${bScript}`);
  }

  const projectPath = join(process.cwd(), normalize(`${distUrl}`));
  const result = shelljs.exec(`${cli} upload --project ${projectPath} -v ${version} -d 上传版本：${version}`, {
    windowsHide: true,
    cwd: cliCwd
  });

  if (!result || result.code !== 0) {
    throw new Error('命令运行出错');
  }
  return result.stdout.toString() || '';
};

function getMiniprogramCli() {
  let cli = '';
  let cliCwd = '';

  switch (platform()) {
    case 'darwin':
      cliCwd = '/Applications/wechatwebdevtools.app/Contents/MacOS';
      cli = './cli';
      break;
    case 'win32':
      cliCwd = 'C:/Program Files (x86)/Tencen/微信web开发者工具';
      cli = 'cli.bat';
      if (!existsSync(cliCwd) && existsSync(join(homedir(), '.win32_wechat_cli'))) {
        const wechatRootPath = readFileSync(join(homedir(), '.win32_wechat_cli'), 'utf8');
        if (existsSync(join(wechatRootPath, cli))) {
          cliCwd = wechatRootPath;
        }
      }
      break;
    default:
      throw new Error('暂不支持该系统');
  }

  return { cli, cliCwd };
}

interface MpUploadOptions extends Options {
  bScript?: string;
  distUrl?: string;
}
