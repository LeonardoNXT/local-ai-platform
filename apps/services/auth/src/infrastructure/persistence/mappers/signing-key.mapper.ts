import { SigningKey } from "../../../domain/entities/signing-key.entity";
import { SigningKeyOrmEntity } from "../entities/signing-key.orm-entity";

export class SigningKeyMapper {
  static toDomain(entity: SigningKeyOrmEntity): SigningKey {
    return SigningKey.create({
      id: entity.id,
      kid: entity.kid,
      algorithm: entity.algorithm as "RS256",
      publicKeyPem: entity.publicKeyPem,
      privateKeyPem: entity.privateKeyPem,
      active: entity.active,
      createdAt: entity.createdAt,
    });
  }

  static toOrm(domain: SigningKey): SigningKeyOrmEntity {
    const entity = new SigningKeyOrmEntity();
    entity.id = domain.id;
    entity.kid = domain.kid;
    entity.algorithm = domain.algorithm;
    entity.publicKeyPem = domain.publicKeyPem;
    entity.privateKeyPem = domain.privateKeyPem;
    entity.active = domain.active;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
