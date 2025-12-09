import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArquitectoService } from './arquitecto.service';
import { ArquitectoController } from './arquitecto.controller';
import { Arquitecto } from './entities/arquitecto.entity';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

/**
 * Módulo de Arquitecto
 */
@Module({
  imports: [TypeOrmModule.forFeature([Arquitecto]), RabbitMQModule],
  controllers: [ArquitectoController],
  providers: [ArquitectoService],
  exports: [ArquitectoService],
})
export class ArquitectoModule {}

