export type GoogleIdentityPayload = {
  scope?: string;
  code: string;
  state: string;
};

export abstract class GoogleIdentityPort {
  abstract Token(payload: GoogleIdentityPayload): Promise<string>;
}
