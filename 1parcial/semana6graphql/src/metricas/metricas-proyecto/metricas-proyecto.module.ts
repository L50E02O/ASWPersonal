import { Module } from '@nestjs/common';
import { MetricasProyectoService } from './metricas-proyecto.service';
import { MetricasProyectoResolver } from './metricas-proyecto.resolver';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';

@Module({
  imports: [HttpModule],
  providers: [MetricasProyectoResolver, MetricasProyectoService, RestClientService],
})
export class MetricasProyectoModule {}
