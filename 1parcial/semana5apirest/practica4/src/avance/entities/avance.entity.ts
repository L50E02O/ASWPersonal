import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Imagen } from 'src/imagen/entities/imagen.entity';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';

// Hecho por Neysser Delgado
@Entity()
export class Avance {
    @PrimaryGeneratedColumn("uuid")
    id_avance: string;

    @Column()
    descripcion: string;

    @CreateDateColumn()
    fecha: Date;

    @OneToOne(()=> Imagen, imagen => imagen.avance)
    imagen: Imagen;
    
    @OneToOne(()=> Proyecto, proyecto => proyecto.avances)
    proyecto: Proyecto
}

