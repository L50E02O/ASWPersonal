import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArquitectoService } from './arquitecto.service';
import { ArquitectoController } from './arquitecto.controller';
import { Arquitecto } from './entities/arquitecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arquitecto])],
  controllers: [ArquitectoController],
  providers: [ArquitectoService],
  exports: [TypeOrmModule],
})
export class ArquitectoModule {}