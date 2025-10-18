// Hecho por Neysser Delgado
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Moderador } from "src/moderador/entities/moderador.entity";
import { MaxLength, IsEmail, IsIn, IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';
import { EstadoIncidencia } from "../entities/incidencia.entity";

export class CreateIncidenciaDto {
  usuarioEmisor: Usuario;
  usuarioInfractor: Usuario;
  moderador: Moderador;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  descripcion: string;

  @IsUrl()
  imagen?: string;

  @IsString()
  estado: EstadoIncidencia;

  @IsDate()
  @IsNotEmpty()
  fecha: Date;
}
