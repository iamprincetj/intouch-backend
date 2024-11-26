FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

USER node

CMD ["./script.sh"]