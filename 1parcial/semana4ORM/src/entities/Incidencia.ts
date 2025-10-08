//Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Moderador } from "./Moderador";

export enum EstadoIncidencia {
  PENDIENTE = 'pendiente',
  RESUELTO = 'resuelto',
  EN_REVISION = 'en revision'
}

@Entity()
export class Incidencia {
  @PrimaryGeneratedColumn("uuid")
  id_incidencia: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario_emisor' })
  usuarioEmisor: Usuario;

  @Column()
  id_usuario_emisor: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario_receptor' })
  usuarioReceptor: Usuario;

  @Column()
  id_usuario_receptor: string;

  @ManyToOne(() => Moderador, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_moderador' })
  moderador?: Moderador;

  @Column({ nullable: true })
  id_moderador?: number;

  @Column()
  descripcion: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column({ type: 'enum', enum: EstadoIncidencia, default: EstadoIncidencia.PENDIENTE })
  estado: EstadoIncidencia;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
