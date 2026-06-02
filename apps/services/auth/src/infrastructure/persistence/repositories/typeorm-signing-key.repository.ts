import { Injectable } from "@nestjs/common";
import { SigningKeyRepositoryPort } from "../../../application/ports/signing-key.repository.port";
import { SigningKeyOrmEntity } from "../entities/signing-key.orm-entity";
import { Repository } from "typeorm/repository/Repository.js";
import { SigningKey } from "../../../domain/entities/signing-key.entity";
import { SigningKeyMapper } from "../mappers/signing-key.mapper";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TypeormSigningKeyRepository implements SigningKeyRepositoryPort {
  constructor(
    @InjectRepository(SigningKeyOrmEntity)
    private readonly repository: Repository<SigningKeyOrmEntity>,
  ) {}

  async findActive(): Promise<SigningKey | null> {
    const entity = await this.repository.findOne({
      where: { active: true },
      order: { createdAt: "DESC" },
    });

    return entity ? SigningKeyMapper.toDomain(entity) : null;
  }

  async save(signingKey: SigningKey): Promise<void> {
    await this.repository.save(SigningKeyMapper.toOrm(signingKey));
  }
}
