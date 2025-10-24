import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMetricaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
