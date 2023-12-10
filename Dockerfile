FROM node:20.9.0-alpine as base

WORKDIR /app

COPY package*.json ./

COPY . .

WORKDIR /app

RUN npm install

EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
