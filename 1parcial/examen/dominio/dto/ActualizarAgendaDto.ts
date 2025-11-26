import { IsDate, IsString, IsOptional, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class ActualizarAgendaDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaAgendada?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  notas?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  estado?: string;
}

