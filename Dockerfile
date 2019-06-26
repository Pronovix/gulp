FROM node:11-alpine

RUN apk add python build-base

WORKDIR /build

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY gulpfile.js .
