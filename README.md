# 下载iconfont命令行

```bash
npm install download-iconfont -g
```

## 在你的项目中添加配置文件

```js
// 如：项目跟目录添加 .diconfontrc.js
module.exports = {
  cookie: '< 你下载iconfont的cookie >',
  spm: '< 链接中的参数 >',
  pid: '< 链接中的参数 >',
  ctoken: '< 链接中的参数 >',
}

```

## 下载

download-iconfont -c <config-path> -o <out-path>

<config-path>: 配置文件路径
<outpath>：下载icon到对应路径

例如：

```bash
download-iconfont -c .diconfontrc.js -o ./style/iconfont
```
