FROM node:alpine
# docker kill discordbots-server && docker rm discordbots-server && docker run -d -p 8999:8999 -p 30001:30001 -e TZ=America/Montreal --name discordbots-server discordbots-server

LABEL owner = jgoralcz
LABEL serviceVersion = 0.2.0
LABEL description = "Basic Server Handler Microservice. Handles voting from discordbots.org"

ENV NODE_ENV=PROD

COPY --chown=node:node config.json /usr/node/
COPY --chown=node:node package*.json /usr/node/
COPY --chown=node:node src/ /usr/node/src/

WORKDIR /usr/node

USER node

RUN npm install request --save && npm install

EXPOSE 8443 30001
CMD ["npm", "start"]
