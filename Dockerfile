FROM node:16.3.0-alpine

WORKDIR /src
RUN npm install -g http-server
COPY package*.json .
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 8081
ENTRYPOINT ["http-server", "./dist", "-p 8081"]
