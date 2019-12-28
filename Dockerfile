FROM node
# docker stop discordbots-server && docker rm discordbots-server && docker run -d -p 8999:8443 -p 30001:30001-v /etc/nginx/ssl/cert.key:/node/config/cert.key -v /etc/nginx/ssl/cert.pem:/node/config/cert.pem --restart always --memory="1024m" --cpu-shares=1024 -e TZ=America/Montreal --name discordbots-server discordbots-server

LABEL owner = jgoralcz
LABEL serviceVersion = 0.2.0
LABEL description = "Basic Server Handler Microservice."

ENV NODE_ENV=PROD

WORKDIR /usr/src/app

COPY --chown=node:node config.json /usr/src/node/
COPY --chown=node:node package*.json /usr/src/node/
COPY --chown=node:node src/ /usr/src/node/src/

WORKDIR /usr/src/node

USER node

RUN npm install request --save && npm install

EXPOSE 8443 30001
CMD ["npm", "start"]
