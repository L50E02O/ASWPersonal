// Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Cliente }  from "../../cliente/entities/cliente.entity"
import { Arquitecto } from "src/arquitecto/entities/arquitecto.entity";

@Entity()
export class Conversacion {
  @PrimaryGeneratedColumn("uuid")
  id_conversacion: string;

  @ManyToOne(() => Cliente, { eager: true })
  cliente: Cliente;

  @ManyToOne(() => Arquitecto, { eager: true })
  arquitecto: Arquitecto;

  @CreateDateColumn()
  fecha: Date;
}
