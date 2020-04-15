FROM node:10-alpine AS build

RUN apk add --no-cache --virtual .gyp python make g++
RUN yarn global add gatsby-cli
COPY . .
RUN yarn
RUN yarn build

FROM nginx:latest
COPY --from=build public /usr/share/nginx/html
COPY nginxconf/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080