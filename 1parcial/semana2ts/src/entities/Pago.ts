import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Conferencia } from "./Conferencia";

@Entity("pagos")
export class Pago {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  monto!: number;

  @Column({ type: "varchar", length: 50 })
  metodoPago!: string;

  @Column({ type: "varchar", length: 50, default: "pendiente" })
  estado!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  numeroTransaccion!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fechaPago!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.pagos)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column()
  usuarioId!: number;

  @ManyToOne(() => Conferencia, (conferencia) => conferencia.pagos)
  @JoinColumn({ name: "conferenciaId" })
  conferencia!: Conferencia;

  @Column()
  conferenciaId!: number;
}

