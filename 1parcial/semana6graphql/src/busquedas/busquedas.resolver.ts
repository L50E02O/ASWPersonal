import { Resolver, Query, Args } from '@nestjs/graphql';
import { BusquedaService } from './busquedas.service';
import { BuscarArquitectosInput } from './dto/buscar-arquitectos.input';
import { BuscarProyectosInput } from './dto/buscar-proyectos.input';
import { BuscarConversacionesInput } from './dto/buscar-conversaciones.input';
import { ArquitectoType } from '../types/arquitecto.type';
import { ProyectoType } from '../types/proyecto.type';
import { Conversacion } from '../types/conversacion.type';

@Resolver()
export class BusquedaResolver {
  constructor(private readonly busquedaService: BusquedaService) {}

  @Query(() => [ArquitectoType], { description: 'Busca arquitectos según filtros' })
  async buscarArquitectos(@Args('filtros') filtros: BuscarArquitectosInput) {
    return this.busquedaService.buscarArquitectos(filtros);
  }

  @Query(() => [ProyectoType], { description: 'Busca proyectos con condiciones avanzadas' })
  async buscarProyectos(@Args('filtros') filtros: BuscarProyectosInput) {
    return this.busquedaService.buscarProyectos(filtros);
  }

  @Query(() => [Conversacion])
  async buscarConversaciones(@Args('filtros', { nullable: true }) filtros?: BuscarConversacionesInput) {
    return this.busquedaService.buscarConversaciones(filtros ?? {});
  }

}
