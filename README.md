# 下载iconfont命令行

```bash
npm install pull-iconfont -g
```

## 在你的项目中添加配置文件

```js
// 如：项目跟目录添加 .pulliconfontrc.js
module.exports = {
  cookie: '< 你下载iconfont的cookie >',
  spm: '< 链接中的参数 >',
  pid: '< 链接中的参数 >',
  ctoken: '< 链接中的参数 >',
  saveDemoFile: false, // 是否保存demo文件
}

```

## 输入下面命令下载

pull-iconfont -c ${config-path} -o ${out-path}

config-path: 配置文件路径
outpath：下载icon到对应路径

例如：

```bash
pull-iconfont -c .pulliconfontrc.js -o ./style/iconfont
```

## FAQ

### 配置文件的参数哪里查看？

![alt text](https://raw.githubusercontent.com/hansinhu/pull-iconfont/master/step01.jpg)

![alt text](https://raw.githubusercontent.com/hansinhu/pull-iconfont/master/step02.png)
