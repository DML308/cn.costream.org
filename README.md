# COStream 中文文档
![](https://travis-ci.org/DML308/cn.costream.org.svg?branch=master)

该站点基于 [Hexo](https://hexo.io/) 构建而成，使用[vue](https://vuejs.org)提供的主题。网站内容在 `src` 文件夹内，格式为 Markdown

英文原版仓库地址：https://github.com/DML308/COStream

## 本地预览的方式
```bash
# 若要预览实验室网站文档则需安装 nodejs 和 hexo
$ npm install -g hexo-cli hexo-server #hexo是一款流行的博客生成工具,用来把.md生成.html 静态网页
$ git clone git@github.com:DML308/cn.costream.org.git #中文站点
# $ git clone git@github.com:DML308/costream.org.git    #英文站点
$ cd cn.costream.org
$ npm install #hexo 工具的package.json里定义了一些Dependencies插件的名字,这些插件并不会把包内容上传github而只是上传它们的名字和版本号以节省网络空间, 所以此时在本地把它们按照定义好的规则下载下来
$ hexo serve #开启 localhost:4000以后这是一个本地的 Web 服务器,如果按下 Ctrl+C 那么该服务器就会停止. 如果既想开着 hexo serve 又想动 git 那么最好开两个Git Bash 窗口
```
## 编辑&提交

``` bash
#首先修改一个 XX.md, 然后执行下列指令
$ git status
$ git add -A
$ git commit 
$ git push
```
push 之后, 持续集成服务(travis-ci)会自动将 master 部署到`gh-pages`, 稍等片刻访问[https://cn.costream.org](https://cn.costream.org)即可看到结果


## 如何参与贡献

目前网站处于维护状态，我们会定期同步更新到英文版.


**注意：**

原则上这里不适合讨论 COStream 的使用问题，建议相关问题在 [COStream 仓库](https://github.com/DML308/COStream)开 `Issue`，以便得到更多人的帮助和更充分的讨论。

## 致谢

感谢 hexo 提供的渲染引擎和 vue 提供的主题.

