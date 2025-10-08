// Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Arquitecto } from "./Arquitecto";

@Entity()
export class Conversacion {
  @PrimaryGeneratedColumn()
  id_conversacion: number;

  @ManyToOne(() => Cliente, { eager: true })
  cliente: Cliente;

  @Column()
  id_cliente: number;

  @ManyToOne(() => Arquitecto, { eager: true })
  arquitecto: Arquitecto;

  @Column()
  id_arquitecto: number;

  @Column('text')
  mensaje: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
