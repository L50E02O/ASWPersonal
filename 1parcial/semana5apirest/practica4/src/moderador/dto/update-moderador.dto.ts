import { IsUUID, IsOptional } from 'class-validator';

export class UpdateModeradorDto {
  @IsOptional()
  @IsUUID('4', { message: 'El id_usuario debe ser un UUID válido' })
  id_usuario?: string;
}
