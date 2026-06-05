import { Module } from "@nestjs/common";
import { InfoIpAddressAdapter } from "../infrastructure/external/info-ip-address.adapter";
import { InfoIpAddressPort } from "../application/ports/info-ip-address.port";
import { UserProviderPort } from "../application/ports/user-provider.port";
import { UserServiceAdapter } from "../infrastructure/external/user-service.adapter";

@Module({
  providers: [
    {
      provide: InfoIpAddressPort,
      useClass: InfoIpAddressAdapter,
    },
    {
      provide: UserProviderPort,
      useClass: UserServiceAdapter,
    },
  ],
  exports: [InfoIpAddressPort, UserProviderPort],
})
export class ExternalModule {}
