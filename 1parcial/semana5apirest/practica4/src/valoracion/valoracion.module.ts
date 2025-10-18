import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoracionService } from './valoracion.service';
import { ValoracionController } from './valoracion.controller';
import { Valoracion } from './entities/valoracion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Valoracion])],
  controllers: [ValoracionController],
  providers: [ValoracionService],
  exports: [TypeOrmModule],
})
export class ValoracionModule {}