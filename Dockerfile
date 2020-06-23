FROM node:10.21.0-jessie
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["./wait-for-it.sh" , "messaging-service:7400" , "--strict" , "--timeout=235" , "--" , "npm", "run", "start-server"]