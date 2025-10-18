//Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Moderador } from "src/moderador/entities/moderador.entity";

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

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario_infractor' })
  usuarioInfractor: Usuario;

  @ManyToOne(() => Moderador, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_moderador' })
  moderador?: Moderador;

  @Column()
  descripcion: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column()
  estado: EstadoIncidencia;

  @CreateDateColumn()
  fecha: Date;
}
