import { CreateMetricaInput } from './create-metrica.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMetricaInput extends PartialType(CreateMetricaInput) {
  @Field(() => Int)
  id: number;
}
