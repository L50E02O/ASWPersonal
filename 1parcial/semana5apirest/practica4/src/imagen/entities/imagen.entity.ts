import { Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, Column } from 'typeorm';
import { Avance } from 'src/avance/entities/avance.entity';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';

@Entity()
export class Imagen {
  @PrimaryGeneratedColumn("uuid")
  id_imagen: string;

  @Column()
  imagen_url: string;

  @Column()
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
