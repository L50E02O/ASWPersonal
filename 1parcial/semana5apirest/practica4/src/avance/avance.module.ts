import { Module } from '@nestjs/common';
import { AvanceService } from './avance.service';
import { AvanceController } from './avance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avance } from './entities/avance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avance])],
  controllers: [AvanceController],
  providers: [AvanceService],
})
export class AvanceModule {}
