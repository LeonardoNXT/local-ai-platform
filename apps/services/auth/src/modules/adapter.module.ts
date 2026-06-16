import { Module } from "@nestjs/common";
import { UserAgentParsePort } from "../application/ports/user-agent-parse.port";
import { UserAgentParseAdapter } from "../infrastructure/adapter/user-agent-parse.adapter";
import { AuthConfigPort } from "../application/ports/auth-config.port";
import { AuthConfigAdapter } from "../infrastructure/adapter/auth-config-adapter";
import { ClockPort } from "../application/ports/clock.port";
import { ClockAdapter } from "../infrastructure/adapter/clock.adapter";
import { TrasnformerPort } from "../application/ports/transformer.port";
import { TrasnformerAdapter } from "../infrastructure/adapter/transformer.adapter";

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
    {
      provide: ClockPort,
      useClass: ClockAdapter,
    },
    {
      provide: TrasnformerPort,
      useClass: TrasnformerAdapter,
    },
  ],
  exports: [UserAgentParsePort, AuthConfigPort, ClockPort, TrasnformerPort],
})
export class AdapterModule {}
