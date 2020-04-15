FROM nginx:latest

COPY public /usr/share/nginx/html
COPY nginxconf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080