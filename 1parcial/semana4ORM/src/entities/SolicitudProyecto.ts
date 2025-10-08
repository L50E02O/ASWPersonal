// Hecho por Neysser Delgado
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Arquitecto } from "./Arquitecto";
import { Cliente } from "./Cliente";

@Entity()
export class SolicitudProyecto {
  @PrimaryGeneratedColumn("uuid")
  id_solicitud: string;

  @Column({ type: "enum", enum: ["pendiente", "aceptado", "rechazado"], default: "pendiente" })
  estado: "pendiente" | "aceptado" | "rechazado";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  @ManyToOne(() => Arquitecto, arquitecto => arquitecto.solicitudes, { eager: true })
  arquitecto: Arquitecto;

  @ManyToOne(() => Cliente, cliente => cliente.solicitudes, { eager: true })
  cliente: Cliente;
}