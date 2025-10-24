import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { DashboardProyectoService } from './dashboard-proyecto.service';
import { DashboardProyecto } from './entities/dashboard-proyecto.entity';


@Resolver(() => DashboardProyecto)
export class DashboardProyectoResolver {
  constructor(private readonly dashboardService: DashboardProyectoService) {}

  @Query(() => DashboardProyecto, { name: 'dashboardProyecto' })
  async getDashboardProyecto(
    @Args('proyectoId', { type: () => ID }) proyectoId: string,
  ): Promise<DashboardProyecto> {
    return this.dashboardService.obtenerDashboardProyecto(proyectoId);
  }
}
