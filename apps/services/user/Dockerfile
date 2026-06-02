FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/services/user/package.json ./apps/services/user/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY apps/services/user ./apps/services/user

WORKDIR /app/packages/shared/messenger
RUN pnpm build

WORKDIR /app/packages/shared/grpc
RUN pnpm build

WORKDIR /app/apps/services/user
RUN pnpm build

EXPOSE 50051

CMD ["pnpm", "start"]