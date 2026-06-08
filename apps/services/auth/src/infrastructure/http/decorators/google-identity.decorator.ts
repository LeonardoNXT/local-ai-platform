import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type Request } from "express";

export type GoogleIdentityPayload = {
  code: string;
  state: string;
  scope?: string;
};

export const GoogleIdentity = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();

    const code = req.query.code;
    const state = req.query.state;
    const scope = req.query.scope;

    return {
      code,
      state,
      scope,
    };
  },
);
