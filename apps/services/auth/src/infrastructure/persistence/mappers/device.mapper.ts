import { Device } from "../../../domain/entities/device.entity";
import { DeviceLocation } from "../../../domain/value-objects/device-location.vo";
import { DeviceOrmEntity } from "../entities/device.orm-entity";

export class DeviceMapper {
  public static toDomain(orm: DeviceOrmEntity): Device {
    return Device.restore(orm.id, {
      userId: orm.user_id,
      name: orm.name,
      type: orm.type,
      location: DeviceLocation.create({
        city: orm.city,
        region: orm.region,
        country: orm.country,
        countryCode: orm.countryCode,
      }),
      userAgent: orm.user_agent,
      lastSeenAt: orm.last_seen_at ?? new Date(),
      createdAt: orm.created_at,
      editedAt: orm.edited_at,
    });
  }

  public static toOrm(domain: Device): DeviceOrmEntity {
    const orm = new DeviceOrmEntity();
    orm.id = domain.id;
    orm.user_id = domain.userId;
    orm.name = domain.name;
    orm.type = domain.type;
    orm.city = domain.location.city;
    orm.region = domain.location.region;
    orm.country = domain.location.country;
    orm.countryCode = domain.location.countryCode;
    orm.user_agent = domain.userAgent;
    orm.last_seen_at = domain.lastSeenAt;
    orm.created_at = domain.createdAt;
    orm.edited_at = domain.editedAt;
    return orm;
  }
}
