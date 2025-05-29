FROM node:20

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm i --omit=dev

COPY . .

EXPOSE 4080

CMD ["npm", "start"]

