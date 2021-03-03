# 下载iconfont命令行

```bash
npm install pull-iconfont --save-dev
```

## 在你的项目中添加配置文件

```js
// 如：项目跟目录添加 .pulliconfontrc.js
module.exports = {
  downloadUrl: '< 下载链接 >',
  cookie: '< 你下载iconfont的cookie >',
  saveDemoFile: false, // 是否保存demo文件
}

```

## 输入下面命令下载

pull-iconfont -c ${config-path}

config-path: 配置文件路径

例如：

```bash
pull-iconfont -c .pulliconfontrc.js
```

## FAQ

### 配置文件的参数哪里查看？

![alt text](https://raw.githubusercontent.com/hansinhu/pull-iconfont/master/step01.jpg)

![alt text](https://raw.githubusercontent.com/hansinhu/pull-iconfont/master/step02.png)
