FROM node:20.6.1

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

CMD ["yarn", "run","build"]
CMD ["yarn", "run","start:prod"]