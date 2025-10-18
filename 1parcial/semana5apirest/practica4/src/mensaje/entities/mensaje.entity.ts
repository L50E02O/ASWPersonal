//Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Conversacion } from "src/conversacion/entities/conversacion.entity";

@Entity()
export class Mensaje {
  @PrimaryGeneratedColumn("uuid")
  id_mensaje: string;

  @ManyToOne(() => Conversacion, { eager: true })
  conversacion: Conversacion;

  @ManyToOne(() => Usuario, { eager: true })
  remitente: Usuario;

  @Column()
  contenido: string;

  @CreateDateColumn()
  fecha_envio: Date;

  @Column({ default: false })
  leido: boolean;

  @Column('simple-array', { nullable: true })
  imagenes?: string[];
}