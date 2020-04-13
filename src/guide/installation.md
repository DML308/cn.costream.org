---
title: 安装 COStreamC
type: guide
order: 21
costream_version: v1.00
---
COStreamC 是到2017年为止的实验室同学维护的项目, 使用 bison 和 yacc 来做语法分析, 使用 C 语言的大量 `struct` 和`#define`特性完成的项目.

### 兼容性
COStreamC 支持在 Ubuntu CentOS 上运行,暂只支持 gcc4.4.x 

### 更新日志

最新稳定版本：{{costream_version}}

每个版本的更新日志见 [GitHub](https://github.com/DML308/COStream/releases)。


## 安装前置软件
安装gcc g++ gdb flex bison cmake

其中gcc和g++的版本要求为4.4.x 可参考下列指令修改默认gcc版本
#### CentOS
```bash
#CentOS
$ yum install flex bison cmake gdb  
$ yum search gcc-4
$ yum install compat-gcc-44
$ yum install compat-gcc-44-c++
#接下来设置4.4的版本为默认编译器
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.4 100
$ sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.4 100 
#如果上面这一步报错提示/usr/bin/gcc已经存在且不为symlink,可以通过mv /usr/bin/gcc /usr/gcc来将原gcc移除PATH路径再执行update-alternatives
$ gcc -v    #查看gcc版本是否成功设置为4.4.7
$ g++ -v    #查看g++版本是否成功设置为4.4.7
```
#### Ubuntu
```bash
#Ubuntu
$ sudo apt-get install flex bison cmake gdb
$ apt list gcc-4.4      #查找库中gcc版本
# Listing... Done
# gcc-4.4/trusty,now 4.4.7-8ubuntu1
$ sudo apt-get install gcc-4.4 
$ apt list g++-4.4      #查找库中g++版本
# Listing... Done
# g++-4.4/trusty 4.4.7-8ubuntu1
$ sudo apt-get install g++-4.4
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.4 100
$ sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.4 100
$ gcc -v    #查看gcc版本是否成功设置为4.4.7
$ g++ -v    #查看g++版本是否成功设置为4.4.7
```
## 获取COStream源码

```bash
$ cd ~
$ git clone https://github.com/DML308/COStream.git
```

## 配置环境变量
```bash
$ sudo vim /etc/profile
#在/etc/profile文件末尾添加：

#set COStream environment
export PATH=~/COStream:$PATH
export COSTREAM_LIB=~/COStream/runtime/X86Lib2/
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

#更新环境变量使之立即生效
$ source /etc/profile
```
## 更新metis文件
<p class="tip">仅支持parmetis-4.0</p>
  ```bash
$ cd src/3rdpart/parmetis-4.0/metis/  
$ make config
$ make
#此时生成了libmetis.a文件,下面将此文件移动到需要的位置
$ cp build/Linux-x86_64/libmetis/libmetis.a ../../include/libmetis.a
$ cp build/Linux-x86_64/libmetis/libmetis.a ../../lib/libmetis.a
```
## 编译
```bash
$ cd ~/COStream/src
$ make clean
$ make
$ sudo cp COStreamC /usr/local/sbin/COStreamC
```
## 编译成功后可以查看版本信息
```bash
$ COStreamC -v
COStreamC
Version 1.00 (your compile date)
```

## 运行COStream程序
尝试运行例子程序中的快速傅里叶变换的COStream程序:
```bash
$ cd ~/COStream
$ mkdir run_tests
$ cp tests/SPLtest/Benchmarks/06-FFT5/FFT6.cos run_tests/FFT6.cos
$ cd run_tests
$ COStreamC -x86 -nCpuCore 2 FFT6.cos -o ./fft/     
#出现 compile successful
$ cd fft
$ make              #生成可执行文件a.out
$ ./a.out           #出现执行结果。
```
## COStream命令说明

编译.cos程序命令：
```bash
$ COStreamC -x86 -nCpucore 2 文件名 -o ./k/
$ COStreamC -gpu -nGpu 4 文件名 -o ./test/ -multi 38400
```
>说明：
* CosC为编译命令
* x86 或 gpu为选择后端
* -nCpucore 或-nGpu 设置运行核数
* ./k/设置生成文件在当前目录下新建名为k的文件夹       

其他操作:
* 执行可执行文件并将结果重定向到result.txt文件： ./可执行文件名 > result.txt
* 求执行时间：time ./可执行文件名  -i 10000
* 生成同步数据流图：dot 文件名.dot  -Tpng -o 图名称.png