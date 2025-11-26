import { IsString, IsOptional, IsDate, IsNumber, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";

export class ActualizarConferenciaDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaInicio?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaFin?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  ubicacion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  capacidadMaxima?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  inscritos?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  estado?: string;
}

