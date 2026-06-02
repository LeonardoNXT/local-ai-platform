import { Injectable } from "@nestjs/common";

import { authConfig } from "../../../infrastructure/config/auth.config";

@Injectable()
export class GetOpenidConfigurationUsecase {
  execute() {
    const issuer = authConfig.issuer;

    return {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
      introspection_endpoint: `${issuer}/oauth/introspect`,
      revocation_endpoint: `${issuer}/oauth/revoke`,

      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      subject_types_supported: ["public"],

      id_token_signing_alg_values_supported: ["RS256"],
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
        "client_secret_post",
      ],

      scopes_supported: ["openid", "profile", "email"],
      claims_supported: ["sub", "email", "name"],
    };
  }
}
