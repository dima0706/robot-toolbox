import { error } from '@robot-toolbox/logger';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import ora from 'ora';
import { join, extname } from 'path';
import { existsSync, writeFileSync } from 'fs';

export = async function iconfont(params: IconfontOptions): Promise<any> {
  const { dir, name: defaultCssName } = params;

  const dirUrl = join(process.cwd(), dir);
  if (!existsSync(dirUrl)) {
    error(`目录不存在：${dirUrl}`);
    process.exit();
  }

  const { downloadUrl } = await inquirer.prompt<{ downloadUrl: string }>({
    type: 'input',
    name: 'downloadUrl',
    message: '请输入iconfont线上地址【Font class代码】',
    validate: (val: string) => !!val
  });

  const checkReg = /font_\d+_.+\.css/;
  if (!checkReg.test(downloadUrl)) {
    error('请输入正确的url地址');
    return await iconfont(params);
  }

  const spinner = ora();

  spinner.start('下载中...');

  const cssFileName = defaultCssName || 'iconfont.css';
  const cssRes = await fetch(`https:${downloadUrl}`);
  const cssCode = await cssRes.text();

  const urlCodeArr = cssCode.match(/url\(\'.*?\'\)/g);

  const promises: Promise<FileInfo>[] = [];
  if (urlCodeArr) {
    urlCodeArr.forEach((url: string) => {
      promises.push(downloadFn(url.slice(5, -2)));
    });
  }

  const codeFileArr = await Promise.all(promises);

  spinner.succeed();

  spinner.start('生成文件替换中...');

  [
    { filename: cssFileName, res: cssCode.replace(/url\(.*?\.(woff2|woff|ttf)/g, `url('iconfont.$1`) },
    ...codeFileArr
  ].forEach(async ({ filename, res }) => {
    let encoding: 'utf8' | 'binary' = 'utf8';
    if (typeof res !== 'string') {
      res = await res.arrayBuffer();
      res = Buffer.from(res);
      encoding = 'binary';
    }
    writeFileSync(`${dirUrl}/${filename}`, res, { encoding });
  });

  spinner.succeed();
};

async function downloadFn(url: string): Promise<FileInfo> {
  const res = await fetch(`https:${url}`);
  return { filename: `iconfont${extname(url.replace(/\?.*$/, ''))}`, res };
}

interface IconfontOptions extends Options {
  dir: string;
  name?: string;
}

interface FileInfo {
  filename: string;
  res: any;
}
