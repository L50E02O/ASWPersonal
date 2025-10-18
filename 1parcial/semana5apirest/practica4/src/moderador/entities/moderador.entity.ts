import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Usuario } from "src/usuario/entities/usuario.entity";

// Esto lo hizo Leo Holguin
@Entity()
export class Moderador {
  @PrimaryGeneratedColumn("uuid")
  id_moderador: string;

  @OneToOne(() => Usuario, { eager: true, cascade: true })
  @JoinColumn()
  usuario: Usuario;
}
