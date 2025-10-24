import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMetricasProyectoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
