import { IsString, IsOptional, IsArray } from 'class-validator';
import { Avance } from 'src/avance/entities/avance.entity';

export class UpdateProyectoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsArray()
  avances?: Partial<Avance>[]; // ✅ Igual que en create
}