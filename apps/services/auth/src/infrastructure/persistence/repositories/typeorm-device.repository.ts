import { Repository } from "typeorm";
import { DeviceRepositoryPort } from "../../../application/ports/device.repository.port";
import { DeviceOrmEntity } from "../entities/device.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Device } from "../../../domain/entities/device.entity";
import { DeviceMapper } from "../mappers/device.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormDeviceRepository implements DeviceRepositoryPort {
  public constructor(
    @InjectRepository(DeviceOrmEntity)
    private readonly repository: Repository<DeviceOrmEntity>,
  ) {}

  public async save(payload: Device): Promise<{ device_id: string }> {
    const deviceMapped = DeviceMapper.toOrm(payload);
    const device_id = (await this.repository.save(deviceMapped)).id;

    return {
      device_id,
    };
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository.delete(payload.id);
  }

  public async findById(payload: { id: string }): Promise<Device | null> {
    const deviceORM = await this.repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!deviceORM) {
      return null;
    }

    return DeviceMapper.toDomain(deviceORM);
  }
}
