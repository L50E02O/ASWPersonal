import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  correo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefono!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password!: string;
}

