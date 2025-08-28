FROM node:20-alpine

WORKDIR /app

COPY api/package*.json ./

RUN npm ci --omit=dev

COPY api/ ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm","start"]

