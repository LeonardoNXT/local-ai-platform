FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]
