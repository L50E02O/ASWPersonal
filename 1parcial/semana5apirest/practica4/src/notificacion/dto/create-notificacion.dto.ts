import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateNotificacionDto {
  @IsUUID('4', { message: 'El id_usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'Debe especificarse el id del usuario que recibe la notificación' })
  id_usuario: string;

  @IsString({ message: 'El mensaje debe ser un texto válido' })
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  mensaje: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo leido debe ser true o false' })
  leido?: boolean;
}
