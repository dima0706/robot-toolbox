# robot-toolbox

## util - TODO
- [ ] commander 【解决同步及异步执行多个shell】
- [ ] toolbox.config.js 【支持本地默认配置及部分插件的校验函数回调】

## plugin - TODO
- [x] mp-upload
- [x] iconfont
- [x] svg-ifx
- [ ] oss-upload
- [ ] app-creater

## 使用前务必安装cli包
`
yarn global add @robot-toolbox/cli
`

## mp-upload

- 安装  
  `yarn global add @robot-toolbox/mp-upload`

- options
  1. bScript构建的script指令，默认值 build
  2. distUrl构建后的文件夹目录（基于当前终端目录），默认值 dist

- TODO  
  - [ ] 自定义version的校验
  - [ ] 读取项目package.json的version及修改version【git】

## iconfont
- 安装  
  `yarn global add @robot-toolbox/iconfont`

- options
  1. 【required】dir 相对于当前终端存放iconfont文件夹路径
  2. name，css文件名 默认值 iconfont.css

## svg-fix
- 安装  
  `yarn global add @robot-toolbox/svg-fix`

- options
  1. url 基于当前终端目录下svg所处的路径，不指定通过终端输入。