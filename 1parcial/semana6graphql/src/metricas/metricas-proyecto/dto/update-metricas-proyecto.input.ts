import { CreateMetricasProyectoInput } from './create-metricas-proyecto.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateMetricasProyectoInput extends PartialType(CreateMetricasProyectoInput) {
  @Field(() => ID)
  id: string;
}
