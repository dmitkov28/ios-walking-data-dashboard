FROM node:lts-alpine as build
WORKDIR /app 

COPY . . 

RUN cd app && npm i 

RUN cd app && npm run build

FROM nginx:1.21.1-alpine 

COPY --from=build /app/app/dist /usr/share/nginx/html 

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
