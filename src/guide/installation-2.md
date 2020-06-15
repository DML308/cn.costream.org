---
title: 安装 COStreamPP
type: guide
order: 22
costream_version: 1.0.0
---
COStreamPP 是到2020年为止的实验室同学维护的项目, 使用C++重构COStreamC项目。

### 兼容性

COStreamPP 支持在 Ubuntu上运行

### 更新日志

最新稳定版本：{{costream_version}}

每个版本的更新日志见 [GitHub](https://github.com/DML308/COStreamPP/releases)。

## 在Ubuntu中安装COStreamPP

gcc g++ gdb 可为Ubuntu系统自带的版本，不限制版本

```bash
#安装flex bison
$ sudo apt-get install flex bison  

#获取源代码
$ git clone git@github.com:DML308/COStreamPP.git

#编译COStreamPP
$ cd COStreamPP/src  
$ cd src
$ make clean
$ make
```

## 运行COStream程序

尝试运行例子程序中的快速傅里叶变换的COStream程序:

```bash
#编译COStream程序，得到目标代码
$ cd ~/COStreamPP
$ ./src/a ./tests/Benchmarks/06-FFT5/FFT6.cos

#执行目标代码
$ cd StaticDistCode/FFT6
$ make clean
$ make
$ ./a.out
```

## COStreamPP命令说明

编译.cos程序命令：

```bash
$ ./src/a -j 2 文件名 -o ./k/
$ ./src/a -j 4 文件名 -o ./test/
```

>说明：

* ./src/a 为编译命令
* -j 设置运行核数
* -o 设置目标代码输出的文件夹

其他操作:

* 求执行时间：time ./可执行文件名  -i 10000
* 生成同步数据流图：dot 文件名.dot  -Tpng -o 图名称.png
