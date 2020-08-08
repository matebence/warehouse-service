FROM node:10.21.0-jessie
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["./wait-for-it.sh" , "vehicle-service:5200" , "--strict" , "--timeout=420" , "--" , "node", "server.js"]