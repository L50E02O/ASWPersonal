import { IsUUID, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { EstadoVerificacion } from '../entities/verifficacion.entity';

export class CreateVerificacionDto {
  @IsUUID('4', { message: 'El id_arquitecto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'Debe especificarse el id del arquitecto' })
  id_arquitecto: string;

  @IsUUID('4', { message: 'El id_moderador debe ser un UUID válido' })
  @IsNotEmpty({ message: 'Debe especificarse el id del moderador' })
  id_moderador: string;

  @IsOptional()
  @IsEnum(EstadoVerificacion, {
    message: 'El estado debe ser uno de: pendiente, verificado o rechazado',
  })
  estado?: EstadoVerificacion;
}
