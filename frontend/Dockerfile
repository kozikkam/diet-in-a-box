FROM nginx

ADD data/conf.d /etc/nginx/conf.d
RUN rm -rf /etc/nginx/sites-enabled/*
ADD build /usr/share/nginx/html
