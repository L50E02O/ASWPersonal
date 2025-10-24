import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateKpisPlataformaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
