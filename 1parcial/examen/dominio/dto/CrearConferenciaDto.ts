import { IsString, IsNotEmpty, IsDate, IsNumber, IsUUID, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";

export class CrearConferenciaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaInicio!: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaFin!: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  ubicacion!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacidadMaxima!: number;

  @IsUUID()
  @IsNotEmpty()
  organizadorId!: string;
}

