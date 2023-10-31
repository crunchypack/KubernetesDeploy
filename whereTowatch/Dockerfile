FROM node:20-alpine AS build
WORKDIR /whereTowatch
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /whereTowatch/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx","-g", "daemon off;"]