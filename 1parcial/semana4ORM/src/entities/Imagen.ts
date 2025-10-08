// Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Proyecto } from "./Proyecto";
import { Avance } from "./Avance";

@Entity()
export class Imagen {
  @PrimaryGeneratedColumn("uuid")
  id_imagen: string;

  @Column()
  imagen_url: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  //  Relación con Proyecto (obligatoria)
  @ManyToOne(() => Proyecto, proyecto => proyecto.imagenes, {
    nullable: false,
    onDelete: "CASCADE",
    eager: true, // opcional: carga automáticamente el proyecto
  })
  proyecto: Proyecto;

  //  Relación con Avance (opcional)
  @ManyToOne(() => Avance, avance => avance.imagen, {
    nullable: true,
    onDelete: "SET NULL",
    eager: true, // opcional
  })
  avance?: Avance;
}
