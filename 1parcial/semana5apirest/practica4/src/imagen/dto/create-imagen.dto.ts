import { IsDate, IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';
import { Avance } from 'src/avance/entities/avance.entity';

export class CreateImagenDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imagen_url: string;

  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @IsNotEmpty()
  proyecto: Proyecto;

  avance?: Avance;   

}
