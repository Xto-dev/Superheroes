FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm rebuild lightningcss

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "dev"]