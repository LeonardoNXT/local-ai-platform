FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/services/auth/package.json ./apps/services/auth/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY apps/services/auth ./apps/services/auth

WORKDIR /app/apps/services/auth

RUN pnpm build

EXPOSE 3002

CMD ["pnpm", "start"]


