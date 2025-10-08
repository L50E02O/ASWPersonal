import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Usuario } from "./Usuario";
import { SolicitudProyecto } from "./SolicitudProyecto";
// lo hizo derlis

@Entity()
export class Arquitecto {
  @PrimaryGeneratedColumn()
  id_arquitecto: number;

  @Column()
  cedula: string;

  @Column("float")
  valoracion_prom_proyecto: number;

  @Column()
  descripcion: string;

  @Column("simple-array")
  especialidades: string[];

  @Column()
  ubicacion: string;

  @Column()
  verificado: boolean;

  @Column()
  vistas_perfil: number;

  @OneToOne(() => Usuario, usuario => usuario.arquitecto)
  @JoinColumn({ name: "id_usuario" })
  usuario: Usuario;

  @OneToMany(() => SolicitudProyecto, solicitud => solicitud.arquitecto)
  solicitudes: SolicitudProyecto[];
}