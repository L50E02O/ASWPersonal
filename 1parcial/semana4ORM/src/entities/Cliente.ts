//lo hizo derlis

import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Usuario } from "./Usuario";
import { SolicitudProyecto } from "./SolicitudProyecto";
import { Valoracion } from "./Valoracion";

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @OneToOne(() => Usuario, usuario => usuario.cliente)
  @JoinColumn()
  usuario: Usuario;

  @Column()
  identificacion: string;

  @OneToMany(() => SolicitudProyecto, solicitud => solicitud.cliente)
  solicitudes: SolicitudProyecto[];
  
  @OneToMany(() => Valoracion, valoracion => valoracion.cliente)
  valoraciones: Valoracion[];
}
