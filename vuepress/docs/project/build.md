# 构建发布
本章节介绍如何构建发布系统。

## 构建
运行`npm run build`命令构建项目：
``` bash 
npm run build

> ...
> Build complete.

> Tip: built files are meant to be served over an HTTP server.
> Opening index.html over file:// won't work.
```
运行结束后将在项目的`dist`目录下生成`index.html`文件和`static`文件夹，这就是我们项目构建的结果。
::: warning 备注
从最后的提示可以看到，直接打开`index.html`文件是不行的。因为默认配置中，资源的访问路径是`/`根目录，
因此直接打开`index.html`会导致加载不到`static`资源文件。当你使用http服务的时候就不会有这个问题。

你可以修改`config/index.js`中`build.assetsPublicPath`的`'/'`为`'./'`来解决这个问题。
（这个方式可能导致你的`font-awesome`图标资源路径错误，解决办法见[issue 179](https://github.com/vuejs/vue-cli/issues/179)，
如将`build/webpack.prod.conf.js`第22行的`extract: true`改为`false`）
:::

## 部署
1. 拷贝根目录下的`dist`目录到服务器的`/your/dist/path/`目录；
2. 使用`apache2`或`nginx`代理访问静态资源文件。以`nginx`为例：
```
server{
    listen 80;
    server_name www.wxample.com;
    location / {
        alias /your/dist/path/;
    }
}
```
::: warning 备注
如果你的网站涉及到子路径，如：`www.wxample.com/vue/`，请参考第一步中的备注，修改项目构建时的资源路径。
:::

## 发布
如果你经常需要将代码发布到仓库中，可能你不想重复执行发布命令，如：
``` bash
git add .
git commit
git pull
git push origin master
```
你可以创建`script/release.sh`脚本，将重复的发布命令写在里面。然后在`package.json`中，
添加`scripts.release: "bash script/release.sh"`。之后你就可以直接执行`npm run release`来发布了。