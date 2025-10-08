import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "./Usuario";

// Esto lo hizo Leo Holguin
@Entity()
export class Notificacion {
  @PrimaryGeneratedColumn("uuid")
  id_notificacion: number;

  @ManyToOne(() => Usuario, usuario => usuario.id_usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // FK column - tipo string para coincidir con Usuario.id_usuario (UUID)
  @Column()
  id_usuario: string;

  @Column()
  mensaje: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  @Column({ default: false })
  leido: boolean;
}
