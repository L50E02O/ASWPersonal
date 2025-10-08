//Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Conversacion } from "./Conversacion";
import { Usuario } from "./Usuario";

@Entity()
export class Mensaje {
  @PrimaryGeneratedColumn()
  id_mensaje: number;

  @ManyToOne(() => Conversacion, { eager: true })
  @JoinColumn({ name: 'id_conversacion' })
  conversacion: Conversacion;

  @Column()
  id_conversacion: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_remitente' })
  remitente: Usuario;

  @Column()
  id_remitente: string;

  @Column('text')
  contenido: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_envio: Date;

  @Column({ default: false })
  leido: boolean;

  @Column('simple-array', { nullable: true })
  imagenes?: string[];
}
