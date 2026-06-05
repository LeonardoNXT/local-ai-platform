import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { resolveClientIp } from "../../utils/ip-recovery";

type HttpRequestLike = {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
};

function getFirstHeaderValue(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === "string") {
    return value.split(",")[0]?.trim() || null;
  }

  if (Array.isArray(value)) {
    return value[0]?.split(",")[0]?.trim() || null;
  }

  return null;
}

export const IpAddress = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<HttpRequestLike>();

    const rawIp =
      getFirstHeaderValue(request.headers["x-forwarded-for"]) ??
      getFirstHeaderValue(request.headers["x-real-ip"]) ??
      request.ip ??
      request.socket?.remoteAddress ??
      "unknown";

    return resolveClientIp(rawIp);
  },
);
