import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from './servicioHTTP.service';

@Module({
  imports: [HttpModule],
  providers: [RestClientService],
  exports: [RestClientService],
})
export class ServicioHTTPModule {}
