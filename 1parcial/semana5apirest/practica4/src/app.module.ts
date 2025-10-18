import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvanceModule } from './avance/avance.module';
import { ClienteModule } from './cliente/cliente.module';
import { IncidenciaModule } from './incidencia/incidencia.module';
import { VerifficacionModule } from './verifficacion/verifficacion.module';
import { ModeradorModule } from './moderador/moderador.module';
import { ValoracionModule } from './valoracion/valoracion.module';
import { ArquitectoModule } from './arquitecto/arquitecto.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { SolicitudproyectoModule } from './solicitudproyecto/solicitudproyecto.module';
import { ImagenModule } from './imagen/imagen.module';
import { ConversacionModule } from './conversacion/conversacion.module';
import { MensajeModule } from './mensaje/mensaje.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
  TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'proyecto-equipo.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Solo desarrollo
  logging: true, // Para debug
 }),
  AvanceModule,
  ClienteModule,
  IncidenciaModule,
  VerifficacionModule,
  ModeradorModule,
  ValoracionModule,
  ArquitectoModule,
  ProyectoModule,
  SolicitudproyectoModule,
  ImagenModule,
  ConversacionModule,
  MensajeModule,
  NotificacionModule,
  UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
