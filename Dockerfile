FROM node
# docker kill discordbots-server && docker rm discordbots-server && docker run -d -p 8999:8999 -p 30001:30001 -e TZ=America/Montreal --name discordbots-server discordbots-server

LABEL owner = jgoralcz
LABEL serviceVersion = 0.1.0
LABEL description = "Basic Server Handler Microservice."

ENV NODE_ENV=PROD

WORKDIR /usr/src/app

COPY --chown=node:node config.json /usr/src/node/
COPY --chown=node:node package*.json /usr/src/node/
COPY --chown=node:node src/ /usr/src/node/src/

WORKDIR /usr/src/node

USER node

RUN npm install request --save && npm install

EXPOSE 8999 30001
CMD ["npm", "start"]
