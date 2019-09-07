FROM node:12.10.0-stretch

# docker kill discordbots-server && docker rm discordbots-server && docker run -d -p 8999:8999 -p 30001:30001 -e TZ=America/Montreal --name discordbots-server discordbots-server

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# install pm2 and our packages.
RUN npm install request --save && npm install

# Bundle app source
COPY . .

EXPOSE 8999 30001
CMD ["node", "index.js"]
