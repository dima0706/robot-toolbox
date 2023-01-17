import { error } from '@robot-toolbox/logger';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import ora from 'ora';

function resolve(dir: string) {
  return path.join(__dirname, dir);
}

function delSvgFillAttr(filePath: string) {
  fs.readFile(filePath, function (err, data: Buffer) {
    if (err) {
      error(err);
      return;
    }
    const newFileData = data.toString().replace(/ fill=".+?"/g, '');
    fs.writeFile(filePath, newFileData, function (err) {
      if (err) {
        error(err);
      }
    });
  });
}

async function checkDirAndFile(path: string) {
  fs.readdir(path, function (err, arr: string[]) {
    if (err) {
      error(err);
      return;
    }
    arr.forEach((name) => {
      const curPath = `${path}/${name}`;
      if (name.includes('.') && name.split('.').slice(-1)[0] === 'svg') {
        delSvgFillAttr(curPath);
      } else {
        checkDirAndFile(curPath);
      }
    });
  });
}

export = async function fixHandle(params: { url?: string }) {
  let { url = '' } = params;

  if (!url) {
    const { basePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'basePath',
        message: '请输入路径',
        default: 'src/assets/svg',
        validate: (val) => {
          if (!val) {
            return '请输入路径后确认';
          }
          return true;
        }
      }
    ]);
    url = basePath;
  }

  const spinner = ora();

  spinner.start('svg修复中...');

  await checkDirAndFile(url);

  spinner.succeed('已完成');
};
