import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type Request } from "express";

export const DeviceToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { cookies: Record<string, string> }>();

    return req.cookies.device_token as string | undefined;
  },
);
