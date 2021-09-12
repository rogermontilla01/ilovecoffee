FROM node:lts-buster

WORKDIR /home/api

COPY ./package.json .

RUN npm install
