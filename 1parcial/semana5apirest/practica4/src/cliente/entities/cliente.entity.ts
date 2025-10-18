//lo hizo derlis
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { SolicitudProyecto } from '../../solicitudproyecto/entities/solicitudproyecto.entity';
import { Valoracion } from '../../valoracion/entities/valoracion.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: string;

  @OneToOne(() => Usuario, usuario => usuario.cliente)
  @JoinColumn()
  usuario: Usuario;

  @Column()
  cedula: string;

  @OneToMany(() => SolicitudProyecto, solicitud => solicitud.cliente)
  solicitudes: SolicitudProyecto[];
  
  @OneToMany(() => Valoracion, valoracion => valoracion.cliente)
  valoraciones: Valoracion[];
}
