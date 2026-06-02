import { Injectable } from "@nestjs/common";

import { SigningKeyGeneratorPort } from "../../ports/signing-key-generator.port";
import { SigningKeyRepositoryPort } from "../../ports/signing-key.repository.port";

@Injectable()
export class EnsureSigningKeyUsecase {
  constructor(
    private readonly signingKeyRepository: SigningKeyRepositoryPort,
    private readonly signingKeyGenerator: SigningKeyGeneratorPort,
  ) {}

  async execute(): Promise<void> {
    console.log("Ensuring signing key...");

    const activeKey = await this.signingKeyRepository.findActive();

    console.log("Active key:", activeKey?.kid ?? null);

    if (activeKey) return;

    const signingKey = this.signingKeyGenerator.generate();

    console.log("Generated key:", signingKey.kid);

    await this.signingKeyRepository.save(signingKey);

    console.log("Signing key saved");
  }
}
