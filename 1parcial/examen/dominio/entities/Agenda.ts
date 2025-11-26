import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Conferencia } from "./Conferencia";

@Entity("agendas")
export class Agenda {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "datetime" })
  fechaAgendada!: Date;

  @Column({ type: "varchar", length: 200, nullable: true })
  notas!: string | null;

  @Column({ type: "varchar", length: 50, default: "pendiente" })
  estado!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fechaCreacion!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.agendas)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column({ type: "varchar", length: 36 })
  usuarioId!: string;

  @ManyToOne(() => Conferencia, (conferencia) => conferencia.agendas)
  @JoinColumn({ name: "conferenciaId" })
  conferencia!: Conferencia;

  @Column({ type: "varchar", length: 36 })
  conferenciaId!: string;
}

