import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BusquedaResolver } from './busquedas.resolver';
import { BusquedaService } from './busquedas.service';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';

@Module({
  imports: [HttpModule],
  providers: [BusquedaResolver, BusquedaService, RestClientService],
})
export class BusquedaModule {}