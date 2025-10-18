// Hecho por Neysser Delgado
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Arquitecto } from 'src/arquitecto/entities/arquitecto.entity';

export class CreateConversacionDto {
    @IsNotEmpty()
    @IsDate()
    fecha: Date;

    @IsNotEmpty()
    cliente: Cliente;

    @IsNotEmpty()
    arquitecto: Arquitecto;
}
