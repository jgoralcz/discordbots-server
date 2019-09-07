FROM node:12

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
