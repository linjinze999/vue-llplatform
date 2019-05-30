# 容器


## 构建镜像
压缩项目构建产物dist目录，按如下方法构建：
1. `Dockerfile`：
```
FROM nginx
COPY mysite.template /etc/nginx
ADD dist.tar.gz /usr/share/nginx/html
RUN /bin/bash -c 'chmod -R 777 /usr/share/nginx/html/dist'
CMD envsubst '$BASE_PATH $BACK_END_URL $SERVER_NAME' < /etc/nginx/mysite.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
```

2. `mysite.template`：
```
server {
  listen              80;
  server_name  ${SERVER_NAME};

  location / {
      root /usr/share/nginx/html;
      index  ${BASE_PATH}index.html ${BASE_PATH}index.htm;
  }

  location ${BASE_PATH}api/ {
      rewrite  ^${BASE_PATH}api/(.*)$ /$1 break;
      # api请求指向后台接口
      proxy_pass   ${BACK_END_URL};
  }

  location ${BASE_PATH} {
      alias /usr/share/nginx/html${BASE_PATH};
      index  ${BASE_PATH}index.html;
      # uri重定向至index.html
      try_files $uri $uri/ ${BASE_PATH}index.html;
  }
}

```

## 运行
以docker-compose为例：`docker-compose.yml`
```
web:
  image: demo:test
  ports:
   - "8080:80"
  environment:
   - SERVER_NAME=localhost
   - BASE_PATH=/
   - BACK_END_URL=http://localhost:8000/

```
