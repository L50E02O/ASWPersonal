import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Rol, Estado } from '../entities/usuario.entity';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsArray()
  especialidades?: string[];

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsBoolean()
  verificado?: boolean;

  @IsOptional()
  vistas_perfil?: number;
}
