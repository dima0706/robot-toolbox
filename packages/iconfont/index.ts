import { error } from '@robot-toolbox/logger';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import ora from 'ora';

export = async function iconfont(params: IconfontOptions): Promise<any> {
  const spinner = ora();
  const { dir } = params;

  // const { downloadUrl } = await inquirer.prompt<{ downloadUrl: string }>({
  //   type: 'input',
  //   name: 'downloadUrl',
  //   message: '请输入iconfont线上地址【Font class代码】',
  //   validate: (val: string) => !!val
  // });
  const downloadUrl = '//at.alicdn.com/t/font_2647670_992j4owiywp.css';

  const checkReg = /font_\d+_.+\.css/;
  if (!checkReg.test(downloadUrl)) {
    error('请输入正确的url地址');
    return await iconfont(params);
  }

  spinner.start('下载中...');

  const cssCode = await downloadFn(downloadUrl);

  const promises: Promise<string>[] = [];
  const urlCodeArr = cssCode.match(/url\([^\)]+\)/gm);
  if (urlCodeArr) {
    urlCodeArr.forEach((codeStr: string) => {
      promises.push(downloadFn(codeStr.slice(5, -2)));
    });
  }
  const codeArr = await Promise.all(promises);

  spinner.succeed('下载完成');

  console.log(dir);
  console.log(codeArr.length);
};

async function downloadFn(url: string): Promise<string> {
  const file = await fetch(`https:${url}`);
  const fileStr = await file.text();
  return fileStr;
}

interface IconfontOptions extends Options {
  dir: string;
}
