import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Conferencia } from "./Conferencia";
import { Pago } from "./Pago";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20 })
  telefono!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fechaRegistro!: Date;

  @OneToMany(() => Conferencia, (conferencia) => conferencia.organizador)
  conferencias!: Conferencia[];

  @OneToMany(() => Pago, (pago) => pago.usuario)
  pagos!: Pago[];
}

