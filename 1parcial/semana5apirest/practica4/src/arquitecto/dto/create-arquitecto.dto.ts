import { IsString, IsBoolean, IsNumber, IsArray, ArrayNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto';
import { CreateSolicitudProyectoDto } from '../../solicitudproyecto/dto/create-solicitudproyecto.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export class CreateArquitectoDto {
  @IsString()
  cedula: string;

  @IsNumber()
  valoracion_prom_proyecto: number;

  @IsString()
  descripcion: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  especialidades: string[];

  @IsString()
  ubicacion: string;

  @IsBoolean()
  verificado: boolean;

  @IsNumber()
  vistas_perfil: number;

  @ValidateNested()
  @Type(() => CreateUsuarioDto)
  usuario: Usuario;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSolicitudProyectoDto)
  solicitudes?: CreateSolicitudProyectoDto[];
}