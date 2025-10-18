import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Arquitecto } from '../../arquitecto/entities/arquitecto.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Avance } from '../../avance/entities/avance.entity';
import { Imagen } from '../../imagen/entities/imagen.entity';
import { Valoracion } from '../../valoracion/entities/valoracion.entity';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id_proyecto: string;

  @ManyToOne(() => Arquitecto)
  @JoinColumn({ name: 'id_arquitecto' })
  arquitecto: Arquitecto;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column({ nullable: true })
  id_conversacion?: string;

  @Column({ nullable: true })
  id_solicitud?: string;

  @Column()
  titulo_proyecto: string;

  @Column({ type: 'float' })
  valoracion_promedio: number;

  @Column()
  descripcion: string;

  @Column()
  tipo_proyecto: 'portafolio' | 'contratado';

  @Column()
  fecha_publicacion: Date;

  @OneToMany(() => Avance, avance => avance.proyecto, { cascade: true })
  avances: Avance[];

  @OneToMany(() => Imagen, (imagen) => imagen.proyecto)
  imagenes: Imagen[];

  @OneToMany(() => Valoracion, (valoracion) => valoracion.proyecto)
  valoraciones: Valoracion[];
}
