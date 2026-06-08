export type GoogleIdentityPayload = {
  scope?: string;
  code: string;
  state: string;
};

export abstract class GoogleIdentityPort {
  abstract token(payload: GoogleIdentityPayload): Promise<string>;
}
