FROM nginx:latest
COPY public /usr/share/nginx/html
COPY nginxconf/nginx.conf /etc/nginx/nginx.conf
COPY certs/domain.crt /etc/ssl/certs/reacthooks.dev.crt
COPY certs/domain.key /etc/ssl/private/reacthooks.dev.key
EXPOSE 443