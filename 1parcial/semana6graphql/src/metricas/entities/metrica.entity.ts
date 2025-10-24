import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Metrica {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
