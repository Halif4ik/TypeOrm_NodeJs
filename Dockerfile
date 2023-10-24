FROM node

WORKDIR .

COPY package.json .
COPY package-lock.json .

RUN yarn install

COPY . .

ENV PORT 3009
EXPOSE $PORT

CMD ["npm", "run","start:dev"]