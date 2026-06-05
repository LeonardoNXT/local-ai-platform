import { InjectRepository } from "@nestjs/typeorm";
import { RefreshTokenRepositoryPort } from "../../../application/ports/refresh-token.repository.port";
import { RefreshTokenOrmEntity } from "../entities/refresh-token.orm-entity";
import { Repository } from "typeorm";
import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import { RefreshTokenMapper } from "../mappers/refresh-token.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormRefreshTokenRepository implements RefreshTokenRepositoryPort {
  public constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repository: Repository<RefreshTokenOrmEntity>,
  ) {}

  public async save(payload: RefreshToken): Promise<void> {
    const refreshTokenMapped = RefreshTokenMapper.toOrm(payload);
    await this.repository.save(refreshTokenMapped);
  }

  public async findById(payload: { id: string }): Promise<RefreshToken | null> {
    const refreshTokenORM = await this.repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!refreshTokenORM) {
      return null;
    }

    const refreshToken = RefreshTokenMapper.toDomain(refreshTokenORM);

    return refreshToken;
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository.delete(payload.id);
    return;
  }
}
