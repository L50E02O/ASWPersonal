import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateValoracionDto {
  @IsString()
  clienteId: string;

  @IsString()
  proyectoId: string;

  @IsNumber()
  calificacion: number;

  @IsString()
  comentario: string;

  @IsDateString()
  fecha: string;
}
