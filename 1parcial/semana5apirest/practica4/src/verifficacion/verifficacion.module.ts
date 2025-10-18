import { Module } from '@nestjs/common';
import { VerifficacionService } from './verifficacion.service';
import { VerifficacionController } from './verifficacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verifficacion } from './entities/verifficacion.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Verifficacion])],
  controllers: [VerifficacionController],
  providers: [VerifficacionService],
})
export class VerifficacionModule {}
