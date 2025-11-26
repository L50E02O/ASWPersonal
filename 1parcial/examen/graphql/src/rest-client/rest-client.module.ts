import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { RestClientService } from "./rest-client.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [RestClientService],
  exports: [RestClientService],
})
export class RestClientModule {}

