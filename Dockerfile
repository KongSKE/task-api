FROM node:17.0.1 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.build.json ./

RUN npm install

RUN npm run build

# CMD [ "node", "dist/main.js" ]