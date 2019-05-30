FROM nginx
COPY mysite.template /etc/nginx
ADD dist.tar.gz /usr/share/nginx/html
RUN /bin/bash -c 'chmod -R 777 /usr/share/nginx/html/dist'
CMD envsubst '$BASE_PATH $BACK_END_URL $SERVER_NAME' < /etc/nginx/mysite.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
