import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Proyecto } from "./Proyecto";
// lo hizo derlis

@Entity()
export class Valoracion {
  @PrimaryGeneratedColumn()
  id_valoracion: number;

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