FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "install", "run-rs", "-g"]
CMD ["run-rs", "--version"]
CMD ["run-rs", "-v", "4.0.0", "--shell"]
CMD ["npm", "run", "start-server"]