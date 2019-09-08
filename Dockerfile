#FROM ubuntu:latest
#USER root
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#
#ENV TZ 'America/Montreal'
#  RUN echo $TZ > /etc/timezone && \
#  apt-get update && apt-get install -y tzdata && \
#  rm /etc/localtime && \
#  ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
#  dpkg-reconfigure -f noninteractive tzdata && \
#  apt-get clean
#
## install node
#RUN apt-get update
#RUN apt-get -y install curl gnupg
#RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
#RUN apt-get -y install nodejs
#
## copy our files
#COPY . .
#
#RUN npm install request --save && npm install
#
#EXPOSE 8999 30001
#
#CMD ["node", "./src/app.js"]

FROM node
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
CMD ["node", "./src/app.js"]
