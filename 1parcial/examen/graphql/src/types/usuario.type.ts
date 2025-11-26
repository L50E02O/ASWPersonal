import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { ConferenciaType } from "./conferencia.type";
import { AgendaType } from "./agenda.type";

@ObjectType()
export class UsuarioType {
  @Field(() => ID)
  id!: string;

  @Field()
  nombre!: string;

  @Field()
  correo!: string;

  @Field()
  telefono!: string;

  @Field()
  fechaRegistro!: Date;

  @Field(() => [ConferenciaType], { nullable: true })
  conferencias?: ConferenciaType[];

  @Field(() => [AgendaType], { nullable: true })
  agendas?: AgendaType[];

  // Campos transformados
  @Field(() => Int, { nullable: true })
  totalConferencias?: number;

  @Field(() => Int, { nullable: true })
  totalAgendas?: number;
}

