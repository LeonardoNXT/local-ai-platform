import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

type HttpRequestLike = {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
};

export const UserAgent = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<HttpRequestLike>();

    const userAgent = request.headers["user-agent"];

    return Array.isArray(userAgent) ? userAgent[0] : (userAgent ?? "");
  },
);
