import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificacionDto {
  @IsOptional()
  @IsUUID('4', { message: 'El id_usuario debe ser un UUID válido' })
  id_usuario?: string;

  @IsOptional()
  @IsString({ message: 'El mensaje debe ser un texto válido' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo leido debe ser true o false' })
  leido?: boolean;
}
