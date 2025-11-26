import { IsDate, IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class CrearAgendaDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaAgendada!: Date;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  notas?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  estado?: string;

  @IsUUID()
  @IsNotEmpty()
  usuarioId!: string;

  @IsUUID()
  @IsNotEmpty()
  conferenciaId!: string;
}

