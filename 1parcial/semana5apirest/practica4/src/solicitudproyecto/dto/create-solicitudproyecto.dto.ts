import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  ACEPTADO = 'aceptado',
  RECHAZADO = 'rechazado',
}

export class CreateSolicitudProyectoDto {
  @IsString()
  @IsOptional() // Opcional porque tiene un valor por defecto en la entidad
  estado?: EstadoSolicitud;

  @IsOptional()
  @IsDateString()
  fecha?: string; // Puede omitirse porque se genera automáticamente

  @IsString()
  arquitectoId: string;

  @IsString()
  clienteId: string;
}