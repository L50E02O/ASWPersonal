import { Module } from '@nestjs/common';
import { ConversacionService } from './conversacion.service';
import { ConversacionController } from './conversacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversacion } from './entities/conversacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversacion])],
  controllers: [ConversacionController],
  providers: [ConversacionService],
})
export class ConversacionModule {}
