import { Module } from '@nestjs/common';
import { DashboardProyectoModule } from './dashboard-proyecto/dashboard-proyecto.module';
import { PerfilCompletoArquitectoModule } from './perfil-completo-arquitecto/perfil-completo-arquitecto.module';

@Module({
  imports: [DashboardProyectoModule, PerfilCompletoArquitectoModule],
})
export class AgregacionesModule {}
