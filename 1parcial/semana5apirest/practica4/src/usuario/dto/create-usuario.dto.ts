import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
  IsDate,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsDateString
} from 'class-validator';
import { Rol, Estado } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty()
  email: string;

  @IsEnum(Rol, { message: 'El rol debe ser cliente, arquitecto o moderador' })
  @IsOptional() // Por defecto es CLIENTE
  rol?: Rol;

  @IsString()
  estado: Estado

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(12, { message: 'La contraseña no puede superar los 12 caracteres' })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsDateString()
  fechaRegistro?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La foto de perfil debe ser una URL válida' })
  foto_perfil?: string;


}
