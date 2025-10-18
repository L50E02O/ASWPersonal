import { IsString, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsArray, IsDateString,} from 'class-validator';
import { CreateArquitectoDto } from '../../arquitecto/dto/create-arquitecto.dto';
import { CreateClienteDto } from '../../cliente/dto/create-cliente.dto';
import { CreateAvanceDto } from '../../avance/dto/create-avance.dto';
import { CreateImagenDto } from '../../imagen/dto/create-imagen.dto';
import { CreateValoracionDto } from '../../valoracion/dto/create-valoracion.dto';
import { Type } from 'class-transformer';

export enum TipoProyecto {
  PORTAFOLIO = 'portafolio',
  CONTRATADO = 'contratado',
}

export class CreateProyectoDto {
  @ValidateNested()
  @Type(() => CreateArquitectoDto)
  arquitecto: CreateArquitectoDto;

  @ValidateNested()
  @Type(() => CreateClienteDto)
  cliente: CreateClienteDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object) // Si tienes DTO para Conversacion, úsalo aquí
  conversacion?: any;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object) // Si tienes DTO para SolicitudProyecto, úsalo aquí
  solicitud?: any;

  @IsString()
  titulo_proyecto: string;

  @IsNumber()
  valoracion_promedio: number;

  @IsString()
  descripcion: string;

  @IsEnum(TipoProyecto)
  tipo_proyecto: TipoProyecto;

  @IsDateString()
  fecha_publicacion: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvanceDto)
  avances?: CreateAvanceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImagenDto)
  imagenes?: CreateImagenDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateValoracionDto)
  valoraciones?: CreateValoracionDto[];
}