// Hecho por derlis 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Arquitecto } from '../../arquitecto/entities/arquitecto.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';

@Entity()
export class SolicitudProyecto {
  @PrimaryGeneratedColumn("uuid")
  id_solicitud: string;

  @Column()
  estado: "pendiente" | "aceptado" | "rechazado";

  @Column()
  fecha: Date;

  @ManyToOne(() => Arquitecto, arquitecto => arquitecto.solicitudes, { eager: true })
  arquitecto: Arquitecto;

  @ManyToOne(() => Cliente, cliente => cliente.solicitudes, { eager: true })
  cliente: Cliente;
}