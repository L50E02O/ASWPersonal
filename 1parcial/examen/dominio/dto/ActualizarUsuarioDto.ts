import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from "class-validator";

export class ActualizarUsuarioDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  correo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}

