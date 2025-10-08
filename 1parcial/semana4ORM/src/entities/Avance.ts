// Hecho por Neysser Delgado
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Imagen } from "./Imagen";
import { Proyecto } from "./Proyecto";

@Entity()
export class Avance {
    @PrimaryGeneratedColumn("uuid")
    id_avance: number;

    @Column()
    descripcion: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    fecha: Date;

    @OneToOne(()=> Imagen, imagen => imagen.avance)
    imagen: Imagen;
    
    @OneToOne(()=> Proyecto, proyecto => proyecto.avances)
    proyecto: Proyecto
}