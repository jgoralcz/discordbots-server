FROM node:alpine

LABEL owner = jgoralcz
LABEL serviceVersion = 0.2.0
LABEL description = "Basic Server Handler Microservice. Handles voting from discordbots.org"

ENV NODE_ENV=PROD

COPY --chown=node:node package*.json /usr/node/
COPY --chown=node:node src/ /usr/node/src/

WORKDIR /usr/node

USER node

RUN npm install

EXPOSE 8443 30001
CMD ["npm", "start"]
