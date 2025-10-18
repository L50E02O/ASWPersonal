import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificacionController],
  providers: [NotificacionService],
})
export class NotificacionModule {}
