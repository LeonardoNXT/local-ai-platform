import { Inject, Injectable } from "@nestjs/common";
import { DeviceRepositoryPort } from "../../ports/device.repository.port";
import { TokenSignerPort } from "../../ports/token-signer.port";
import { Device } from "../../../domain/entities/device.entity";
import { ClockPort } from "../../ports/clock.port";

export type GetDeviceUsecaseInput = {
  deviceToken?: string;
};

export type GetDeviceUsecaseOutput = {
  device: Device;
};

@Injectable()
export class GetDeviceUsecase {
  public constructor(
    @Inject(DeviceRepositoryPort)
    private readonly repository: DeviceRepositoryPort,
    @Inject(TokenSignerPort) private readonly tokenSigner: TokenSignerPort,
    @Inject(ClockPort) private readonly clock: ClockPort,
  ) {}

  public async execute(
    input: GetDeviceUsecaseInput,
  ): Promise<GetDeviceUsecaseOutput> {
    if (!input.deviceToken) {
      throw new Error("The device token is not exists");
    }

    const token = await this.tokenSigner.verify<{ sub: string }>(
      input.deviceToken,
    );

    const device = await this.repository.findById({
      id: token.sub,
    });

    if (!device) {
      throw new Error("The device is not exists");
    }

    device.use(this.clock.nowIso8601());

    await this.repository.save(device);

    return {
      device,
    };
  }
}
