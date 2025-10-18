//hecho por derlis
import { IsNotEmpty, IsString } from 'class-validator';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  usuario: Usuario;

  @IsString()
  @IsNotEmpty()
  cedula: string;
}