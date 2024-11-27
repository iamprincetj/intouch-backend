FROM node:20

WORKDIR /usr/src/app

COPY ./package.json .

ENV DATABASE_URL_PROD=postgresql://ufobqechgid7wabpvyag:9gQTUSfEyDqprqbPLFJl5WzwkLV0Xt@bzdpf0toaiskq3lbnqyn-postgresql.services.clever-cloud.com:50013/bzdpf0toaiskq3lbnqyn
ENV PORT=5000
ENV JWT_SECRET=mysecretpassword

ENV DATABASE_URL_DEV=postgres://myuser:mysecretpassword@5432:5432/mydb


RUN npm install

COPY --chown=node:node . .

USER node

CMD ["./script.sh"]