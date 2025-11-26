import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Pago } from "./Pago";

@Entity("conferencias")
export class Conferencia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 200 })
  titulo!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "datetime" })
  fechaInicio!: Date;

  @Column({ type: "datetime" })
  fechaFin!: Date;

  @Column({ type: "varchar", length: 200 })
  ubicacion!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: "int", default: 0 })
  capacidadMaxima!: number;

  @Column({ type: "int", default: 0 })
  inscritos!: number;

  @Column({ type: "varchar", length: 50, default: "activa" })
  estado!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.conferencias)
  @JoinColumn({ name: "organizadorId" })
  organizador!: Usuario;

  @Column()
  organizadorId!: number;

  @OneToMany(() => Pago, (pago) => pago.conferencia)
  pagos!: Pago[];
}

