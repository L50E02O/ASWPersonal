import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Arquitecto } from "./Arquitecto";
import { Moderador } from "./Moderador";
//Esto lo hizo Leo Holguin
export enum EstadoVerificacion {
  PENDIENTE = 'pendiente',
  VERIFICADO = 'verificado',
  RECHAZADO = 'rechazado'
}

@Entity()
export class Verificacion {
  @PrimaryGeneratedColumn("uuid")
  id_verificacion: string;

  @ManyToOne(() => Arquitecto, arquitecto => arquitecto.id_arquitecto, { eager: true })
  @JoinColumn({ name: 'id_arquitecto' })
  arquitecto: Arquitecto;

  @Column()
  id_arquitecto: number;

  @ManyToOne(() => Moderador, { eager: true })
  @JoinColumn({ name: 'id_moderador' })
  moderador: Moderador;

  @Column()
  id_moderador: number;

  @Column({ type: 'enum', enum: EstadoVerificacion, default: EstadoVerificacion.PENDIENTE })
  estado: EstadoVerificacion;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_verificacion: Date;
}
