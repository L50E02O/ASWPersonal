import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { MetricasProyectoService } from './metricas-proyecto.service';
import { MetricasProyecto } from './entities/metricas-proyecto.entity';
import { CreateMetricasProyectoInput } from './dto/create-metricas-proyecto.input';
import { UpdateMetricasProyectoInput } from './dto/update-metricas-proyecto.input';

@Resolver(() => MetricasProyecto)
export class MetricasProyectoResolver {
  constructor(private readonly metricasProyectoService: MetricasProyectoService) {}

  @Mutation(() => MetricasProyecto)
  createMetricasProyecto(@Args('createMetricasProyectoInput') createMetricasProyectoInput: CreateMetricasProyectoInput) {
    return this.metricasProyectoService.create(createMetricasProyectoInput);
  }

  @Query(() => [MetricasProyecto], { name: 'todosMetricasProyecto' })
  findAll() {
    return this.metricasProyectoService.findAll();
  }

  @Query(() => MetricasProyecto, { name: 'metricasProyecto' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.metricasProyectoService.findOne(id);
  }

  @Mutation(() => MetricasProyecto)
  updateMetricasProyecto(@Args('updateMetricasProyectoInput') updateMetricasProyectoInput: UpdateMetricasProyectoInput) {
    return this.metricasProyectoService.update(updateMetricasProyectoInput.id, updateMetricasProyectoInput);
  }

  @Mutation(() => MetricasProyecto)
  removeMetricasProyecto(@Args('id', { type: () => ID }) id: string) {
    return this.metricasProyectoService.remove(id);
  }
}
