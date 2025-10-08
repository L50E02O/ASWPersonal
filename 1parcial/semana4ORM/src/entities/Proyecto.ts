import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Arquitecto } from "./Arquitecto";
import { Cliente } from "./Cliente";
import { Avance } from "./Avance";
import { Imagen } from "./Imagen";
import { Valoracion } from "./Valoracion";

// lo hizo derlis

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  id_proyecto: number;

  @ManyToOne(() => Arquitecto)
  @JoinColumn({ name: "id_arquitecto" })
  arquitecto: Arquitecto;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: "id_cliente" })
  cliente: Cliente;

  @Column({ nullable: true })
  id_conversacion?: number;

  @Column({ nullable: true })
  id_solicitud?: number;

  @Column()
  titulo_proyecto: string;

  @Column({ type: "float" })
  valoracion_promedio: number;

  @Column()
  descripcion: string;

  @Column()
  tipo_proyecto: "portafolio" | "contratado";

  @Column()
  fecha_publicacion: Date;

  @OneToMany(() => Avance, avance => avance.proyecto)
  avances: Avance[];

  @OneToMany(() => Imagen, imagen => imagen.proyecto)
  imagenes: Imagen[];
  
  @OneToMany(() => Valoracion, valoracion => valoracion.proyecto)
  valoraciones: Valoracion[];
}