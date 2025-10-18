import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
// lo hizo derlis

@Entity()
export class Valoracion {
  @PrimaryGeneratedColumn()
  id_valoracion: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: "id_cliente" })
  cliente: Cliente;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: "id_proyecto" })
  proyecto: Proyecto;

  @Column()
  calificacion: number;

  @Column()
  comentario: string;

  @Column()
  fecha: Date;
}