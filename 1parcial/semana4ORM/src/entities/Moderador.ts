import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
// Esto lo hizo Leo Holguin
@Entity()
export class Moderador {
  @PrimaryGeneratedColumn()
  id_moderador: number;

  @OneToOne(() => Usuario, { eager: true, cascade: true })
  @JoinColumn()
  usuario: Usuario;
}
