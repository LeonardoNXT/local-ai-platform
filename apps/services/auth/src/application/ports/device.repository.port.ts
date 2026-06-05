import { type Device } from "../../domain/entities/device.entity";

export abstract class DeviceRepositoryPort {
  public abstract save(payload: Device): Promise<{ device_id: string }>;
  public abstract findById(payload: { id: string }): Promise<Device | null>;
  public abstract delete(payload: { id: string }): Promise<void>;
}
