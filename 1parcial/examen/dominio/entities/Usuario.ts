import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Conferencia } from "./Conferencia";
import { Agenda } from "./Agenda";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  correo!: string;

  @Column({ type: "varchar", length: 20 })
  telefono!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fechaRegistro!: Date;

  @OneToMany(() => Conferencia, (conferencia) => conferencia.organizador)
  conferencias!: Conferencia[];

  @OneToMany(() => Agenda, (agenda) => agenda.usuario)
  agendas!: Agenda[];
}

