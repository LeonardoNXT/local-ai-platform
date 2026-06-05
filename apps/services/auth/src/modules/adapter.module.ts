import { Module } from "@nestjs/common";
import { UserAgentParsePort } from "../application/ports/user-agent-parse.port";
import { UserAgentParseAdapter } from "../infrastructure/adapter/user-agent-parse.adapter";
import { AuthConfigPort } from "../application/ports/auth-config.port";
import { AuthConfigAdapter } from "../infrastructure/adapter/auth-config-adapter";

@Module({
  providers: [
    {
      provide: UserAgentParsePort,
      useClass: UserAgentParseAdapter,
    },
    {
      provide: AuthConfigPort,
      useClass: AuthConfigAdapter,
    },
  ],
  exports: [UserAgentParsePort, AuthConfigPort],
})
export class AdapterModule {}
