---
title: 安装 COStreamJS
type: guide
order: 23
costream_version: 1.0.0
---
### 当前版本号和持续集成服务测试结果
![](https://img.shields.io/npm/v/costreamjs) [![Build Status](https://travis-ci.com/DML308/COStreamJS.svg?branch=master)](https://travis-ci.com/DML308/COStreamJS) 
>若要了解持续集成服务,可查看[持续集成服务 Travis CI 教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
## COStreamJS 是什么? 为什么要写该版本?
COStreamJS 是 COStream 数据流编程语言的 Javscript 实现, 目的是解决原项目**上万行 C++ 源码**给新人带来的理解难度, 降低 COStream 的上手门槛. 目前业内流行的机器学习框架均提供了js 版本, 例如[Tensorflow.js](https://tensorflow.google.cn/js) 和[Keras.js](https://github.com/transcranial/keras-js). 下表是 COStream 目前两个版本的对比:

|   | COStreamPP  | COStreamJS |
|---|---|---|
|支持的操作系统  | Ubuntu 16+ / Mac OSX| Ubuntu 16+ / Mac OSX / Windows  |
| 代码行数 | 31471  |  7032 |
| 注释行数(占比) | 2156(6.8%)  | 1263(16%) |
| 编译器安装所需依赖 | win 系统需安装 linux 虚拟机 <br>gcc 5.4.0+ / flex / bison/ | node.js |
| 生成的目标代码的运行平台 | Linux / Mac OSX | Linux / Mac OSX / Chrome <br>支持 Windows 和 手机的浏览器 | 
| 开发和调试环境 | gdb / vscode | Chrome |

## 我不想了解 COStream 源码, 如何快速运行 COStreamJS ?
COStreamJS 现提供两种方式方便用户使用: 命令行入口 和 浏览器入口
### 1. 命令行入口
首先[安装 node.js 环境](http://nodejs.cn/download/), 并添加好环境变量, Windows 用户可查看[教程](https://www.cnblogs.com/liuqiyun/p/8133904.html), Mac 用户请自己百度, Ubuntu 用户直接执行下面两句命令即可
```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
nvm install --lts
```
接着全局安装 COStreamJS, 编译运行
```bash
npm install -g costreamjs
costreamjs -v                    #查看版本号
wget https://raw.githubusercontent.com/DML308/COStreamJS/master/examples/wang.cos #从网上加载一个例子程序
costreamjs wang.cos -j2 -o ./wang/ #将 wang.cos 编译为目标代码, 其中 -j4 表示设置目标核数为2
cd wang  
make                             # 编译目标代码
./a.out                          # 运行目标代码, 查看结果
```

### 2. 浏览器入口
访问 [https://demo.costream.org](https://demo.costream.org), 在右上角选择`示例程序`并依次点击 **一键编译** -- **查看目标代码** -- **运行目标代码**  , 

#### 编译后可查看 SDF 图
![编译后可查看 SDF 图](https://i.loli.net/2020/06/15/NGg2jS64alKwenV.png)
#### 手写数字识别的程序运行截图
![image.png](https://i.loli.net/2020/06/15/Yq1zuTPIfpjbkQw.png)

#### 目前在线版提供了5个例子程序
| 程序名  | 说明 |
|---|--- |
| DCT.cos | 对8x8的数据进行二维 DCT 变换|
| FFT.cos | 对8个数据进行 FFT 变换|
| matrix.cos | 矩阵扩展的各接口展示|
| showErrors.cos| 编译器语义检查的报错能力展示 |
| mnist.cos | 使用全连接神经网络进行手写数字识别 |

## 我想修改 COStreamJS 的源码, 应该怎么做?
首先从 github 上 clone 项目并自动安装依赖
```bash
git clone https://github.com/DML308/COStreamJS.git
cd COStreamJS
npm install
npm install -g simple-server # 该指令可选, 安装一个启动简单服务器的工具
```
接着对源码进行修改, 并查看修改结果
```bash
cd COStreamJS # 进入文件目录
              # 修改 xxx 文件的 xx 行
npm run build            
npm run dev   # 启动监听程序, 该监听程序会自动识别源代码的改动, 将改动同步至 `/dist/COStream.js`
cd dist
simple-server # 启动一个 WEB 服务器, 此时即可使用浏览器访问下图中给出的地址(http://localhost:3000)
   ┌─────────────────────────────────────────────────┐
   │                                                 │
   │   Serving!                                      │
   │                                                 │
   │   - Local:            http://localhost:3000     │
   │   - On Your Network:  http://192.168.0.4:3000   │
   │                                                 │
   │   Copied local address to clipboard!            │
   │                                                 │
   └─────────────────────────────────────────────────┘
```

### 一个修改源代码并查看效果的例子
在这次代码修改示例中, 我修改了`/src/main.js`中的主流程`COStreamJS.main`函数, 增加代码为在执行完语法解析阶段后, 提示`Hello World`并将语法树输出至控制台

![image.png](https://i.loli.net/2020/06/15/7gLBnU8sSfHtOZv.png)
在控制台中启动源码修改监听器`npm run dev`和本地 WEB 服务器`simpler-server`(默认访问`/dist/index.html`)
![image.png](https://i.loli.net/2020/06/15/HyK9amIj2TdPAxh.png)
在Chrome 浏览器的控制台 中查看`本次代码修改的效果`, 还可以打断点调试
![image.png](https://i.loli.net/2020/06/15/oE1t65OT2iaJVWh.png)

## 关于该项目使用到的库
- **怎么做到绘制语法树和绘制数据流图的 ?** 
  答: 遍历语法树生成[dot字符串](https://zhuanlan.zhihu.com/p/21993254), 再使用[viz.js](http://viz-js.com/)工具绘图
- **C++项目打包需要使用 Makefile, 该 JS 项目打包你用的什么?**
  答: 我使用[rollup](https://www.rollupjs.com/)作为打包工具, 生成的代码可读性极高
- **你的代码编辑框、操作按钮、表格很好看, 用的什么?**
  答: 代码编辑框用的[ace editor](https://ace.c9.io/), 按钮和表格用的[vue-material](https://vuematerial.io/), 它是一个基于[Vue](cn.vuejs.org)的 UI 框架
- **手写数字识别那个手写板和柱形图表你用的什么?**
  答: 手写板我基于[SignaturePad]()进行了改造,从`280 x 280`的画布像素提取`28 x 28`的像素数据作为手写数字识别程序的输入. 柱形图表我用的[Chart](http://chartjs.cn/)