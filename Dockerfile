FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

CMD ["./script.sh"]