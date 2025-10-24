import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Busqueda {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
