import { Module } from '@nestjs/common';
import { ModeradorService } from './moderador.service';
import { ModeradorController } from './moderador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moderador } from './entities/moderador.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Moderador])],
  controllers: [ModeradorController],
  providers: [ModeradorService],
})
export class ModeradorModule {}
