# 构建发布
本章节介绍如何构建发布系统。

## 开发
开发时使用的接口数据有两种方式：
1. 本地mock：注释`.env.development`的`VUE_APP_BACK_END_URL`值
2. 某一测试后台返回值：设置`.env.development`的`VUE_APP_BACK_END_URL`值为后台的url
（你可以拷贝`.env.development`为`.env.development.local`，然后修改`.env.development.local`值，因为该文件优先级高于`.env.development`，且不会被git跟踪）

## 构建
运行`npm run build`命令构建项目：
``` bash 
npm run build

> vue-cli-service build
⠙  Building for production...

> ...

>  DONE  Build complete. The dist directory is ready to be deployed.
   INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
```
运行结束后在项目的目录下会生成`dist`文件夹，这就是我们项目构建的结果。
::: warning 备注
直接打开`dist/index.html`文件是无法正常访问页面的。因为默认配置中，资源的访问路径是`/`根目录，
因此直接打开`index.html`会导致加载不到`static`资源文件。当你使用http服务的时候就不会有这个问题。

当你想在本地直接打开网页的时候，你可以修改`vue.config.js`中的`publicPath`为`'./'`来解决这个问题（或者直接修改`.env`配置文件的环境变量`VUE_APP_BASE_PATH=./`）。

**注意**：Vue Router的`history`模式不支持系统路径被配置为相对路径，只有`hash`模式才可以。（[publicpath说明](https://cli.vuejs.org/zh/config/#publicpath)）
:::

## 部署
1. 拷贝根目录下的`dist`目录到服务器的`/your/dist/path/`目录；
2. 使用`apache2`或`nginx`代理访问静态资源文件。以`nginx`为例：
```
server{
    listen 80;
    server_name www.example.com;
    location / {
        alias /your/dist/path/;
    }

    location /api/ {
        rewrite  ^/api/(.*)$ /$1 break;
        # api请求代理到实际后台接口
        proxy_pass   ${BACK_END_URL};
    }
}
```
::: warning 备注
如果你使用了Vue Router的`history`模式，还需要把所有的uri重定向到index.html页面
（单页面应用固有问题，访问非index.html页面是找不到资源的。Uri路径形如a/b/c.html，需要重定向至index.hml页面，使用index.html自身的路由去解析加载。）
```{14-17}
server{
    listen 80;
    server_name www.example.com;
    location / {
        alias /your/dist/path/;
    }

    location /api/ {
        rewrite  ^/api/(.*)$ /$1 break;
        # api请求代理到实际后台接口
        proxy_pass   ${BACK_END_URL};
    }

    location / {
        # uri重定向至index.html
        try_files $uri $uri/ index.html;
    }
}
```
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
