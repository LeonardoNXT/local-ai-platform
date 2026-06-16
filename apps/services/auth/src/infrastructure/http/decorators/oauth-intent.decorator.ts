import {
  createParamDecorator,
  HttpException,
  HttpStatus,
  type ExecutionContext,
} from "@nestjs/common";
import { type Request } from "express";

export const OAuthIntentToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req: Request = ctx.switchToHttp().getRequest();
    const oauthIntentToken = req.cookies.oauth_intent as string | undefined;

    if (!oauthIntentToken) {
      throw new HttpException(
        "The OAuth Intent was not found.",
        HttpStatus.NO_CONTENT,
      );
    }

    return oauthIntentToken;
  },
);
