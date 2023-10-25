FROM node:20.6.1

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3008

CMD ["yarn", "run","start:dev"]