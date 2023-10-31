FROM node:20-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY . .
EXPOSE 8081
RUN npm install
ENV DEBUG='whereTowatchApi:*'
ENTRYPOINT ["npm", "run", "dev"]