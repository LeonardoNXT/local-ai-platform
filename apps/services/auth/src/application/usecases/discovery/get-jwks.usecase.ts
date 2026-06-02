import { Inject, Injectable } from "@nestjs/common";

import { JwksExporterPort } from "../../ports/jwks-exporter.port";
import { SigningKeyRepositoryPort } from "../../ports/signing-key.repository.port";

@Injectable()
export class GetJwksUsecase {
  constructor(
    @Inject(SigningKeyRepositoryPort)
    private readonly signingKeyRepository: SigningKeyRepositoryPort,

    @Inject(JwksExporterPort)
    private readonly jwksExporter: JwksExporterPort,
  ) {}

  async execute() {
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      return { keys: [] };
    }

    return this.jwksExporter.export(signingKey);
  }
}
