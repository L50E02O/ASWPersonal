import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { UsuarioType } from './usuario.type';

@ObjectType()
export class Conversacion {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  usuarioId: string;

  @Field(() => ID)
  arquitectoId: string;

  @Field()
  fechaInicio: string;

  @Field(() => UsuarioType)
  usuario: UsuarioType;
}
