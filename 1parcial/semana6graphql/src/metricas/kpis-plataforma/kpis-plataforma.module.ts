import { Module } from '@nestjs/common';
import { KpisPlataformaService } from './kpis-plataforma.service';
import { KpisPlataformaResolver } from './kpis-plataforma.resolver';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';

@Module({
  imports: [HttpModule],
  providers: [KpisPlataformaResolver, KpisPlataformaService, RestClientService],
})
export class KpisPlataformaModule {}
