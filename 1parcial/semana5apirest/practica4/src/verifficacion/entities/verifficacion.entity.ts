import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Arquitecto } from "src/arquitecto/entities/arquitecto.entity";
import { Moderador } from "src/moderador/entities/moderador.entity";
//Esto lo hizo Leo Holguin
export enum EstadoVerificacion {
  PENDIENTE = 'pendiente',
  VERIFICADO = 'verificado',
  RECHAZADO = 'rechazado'
}

@Entity()
export class Verifficacion {
  @PrimaryGeneratedColumn("uuid")
  id_verificacion: string;

  @ManyToOne(() => Arquitecto, arquitecto => arquitecto.id_arquitecto, { eager: true })
  @JoinColumn({ name: 'id_arquitecto' })
  arquitecto: Arquitecto;

  @Column("uuid")
  id_arquitecto: string;

  @ManyToOne(() => Moderador, { eager: true })
  @JoinColumn({ name: 'id_moderador' })
  moderador: Moderador;

  @Column("uuid")
  id_moderador: string;

  @Column()
  estado: EstadoVerificacion;

  @CreateDateColumn()
  fecha_verificacion: Date;
  static PENDIENTE: EstadoVerificacion | undefined;
}
