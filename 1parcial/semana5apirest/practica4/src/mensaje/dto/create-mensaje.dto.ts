// Hecho por Neysser Delgado
import { IsBoolean, IsDate, IsEmail, IsEmpty, isEmpty, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Conversacion } from 'src/conversacion/entities/conversacion.entity';

export class CreateMensajeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    contenido: string;

    @IsNotEmpty()
    @IsDate()
    fecha_envio: Date;

    @IsNotEmpty()
    @IsBoolean()
    leido: boolean;

    @IsEmpty()
    @IsUrl()
    imagenes?: string[];

    @IsNotEmpty()
    conversacion: Conversacion;

    @IsNotEmpty()
    remitente: Usuario;
}
