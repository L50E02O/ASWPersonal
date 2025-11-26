import { ObjectType, Field, ID } from "@nestjs/graphql";
import { UsuarioType } from "./usuario.type";
import { ConferenciaType } from "./conferencia.type";

@ObjectType()
export class AgendaType {
  @Field(() => ID)
  id!: string;

  @Field()
  fechaAgendada!: Date;

  @Field({ nullable: true })
  notas?: string;

  @Field()
  estado!: string;

  @Field()
  fechaCreacion!: Date;

  @Field(() => UsuarioType, { nullable: true })
  usuario?: UsuarioType;

  @Field(() => ConferenciaType, { nullable: true })
  conferencia?: ConferenciaType;

  // Campos transformados
  @Field(() => Boolean, { nullable: true })
  proxima?: boolean;

  @Field(() => String, { nullable: true })
  tiempoRestante?: string;
}

