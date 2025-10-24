import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class ValoracionType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  usuarioId?: string;

  @Field(() => String, { nullable: true })
  proyectoId?: string;

  @Field(() => Float, { nullable: true })
  puntuacion?: number;

  @Field({ nullable: true })
  comentario?: string;

  @Field({ nullable: true })
  fecha?: string;
}
