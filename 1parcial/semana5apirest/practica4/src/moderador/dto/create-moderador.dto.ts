import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateModeradorDto {
  @IsUUID('4', { message: 'El id_usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'Debe especificarse el id del usuario asociado' })
  id_usuario: string;
}
