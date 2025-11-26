import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { UsuarioType } from "./usuario.type";
import { AgendaType } from "./agenda.type";

@ObjectType()
export class ConferenciaType {
  @Field(() => ID)
  id!: string;

  @Field()
  titulo!: string;

  @Field()
  descripcion!: string;

  @Field()
  fechaInicio!: Date;

  @Field()
  fechaFin!: Date;

  @Field()
  ubicacion!: string;

  @Field(() => Float)
  precio!: number;

  @Field(() => Int)
  capacidadMaxima!: number;

  @Field(() => Int)
  inscritos!: number;

  @Field()
  estado!: string;

  @Field(() => UsuarioType, { nullable: true })
  organizador?: UsuarioType;

  @Field(() => [AgendaType], { nullable: true })
  agendas?: AgendaType[];

  // Campos transformados
  @Field(() => Int, { nullable: true })
  cuposDisponibles?: number;

  @Field(() => Float, { nullable: true })
  porcentajeOcupacion?: number;

  @Field(() => Boolean, { nullable: true })
  disponible?: boolean;

  @Field(() => String, { nullable: true })
  duracion?: string;
}

