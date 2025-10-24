import { Module } from '@nestjs/common';
import { DashboardProyectoService } from './dashboard-proyecto.service';
import { DashboardProyectoResolver } from './dashboard-proyecto.resolver';
import { ServicioHTTPModule } from 'src/ServicioHTTP/servicioHTTP.module';

@Module({
  imports: [ServicioHTTPModule],
  providers: [DashboardProyectoResolver, DashboardProyectoService],
})
export class DashboardProyectoModule {}
