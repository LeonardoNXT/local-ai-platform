import { InjectRepository } from "@nestjs/typeorm";
import { RefreshTokenFamilyRepositoryPort } from "../../../application/ports/refresh-token-family.repository.port";
import { RefreshTokenFamilyOrmEntity } from "../entities/refresh-token-family.orm-entity";
import { Repository } from "typeorm";
import { RefreshTokenFamily } from "../../../domain/entities/refresh-token-family.entity";
import { RefreshTokenFamilyMapper } from "../mappers/refresh-token-family.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormRefreshTokenFamilyRepository implements RefreshTokenFamilyRepositoryPort {
  public constructor(
    @InjectRepository(RefreshTokenFamilyOrmEntity)
    private readonly repository: Repository<RefreshTokenFamilyOrmEntity>,
  ) {}

  public async save(payload: RefreshTokenFamily): Promise<void> {
    const refreshTokenFamilyMapped = RefreshTokenFamilyMapper.toOrm(payload);
    await this.repository.save(refreshTokenFamilyMapped);
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository.delete(payload.id);
  }

  public async findById(payload: {
    id: string;
  }): Promise<RefreshTokenFamily | null> {
    const refreshTokenORM = await this.repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!refreshTokenORM) {
      return null;
    }

    return RefreshTokenFamilyMapper.toDomain(refreshTokenORM);
  }
}
