import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EstadisticaArquitectoService } from './estadistica-arquitecto.service';
import { EstadisticaArquitecto } from './entities/estadistica-arquitecto.entity';
import { CreateEstadisticaArquitectoInput } from './dto/create-estadistica-arquitecto.input';
import { UpdateEstadisticaArquitectoInput } from './dto/update-estadistica-arquitecto.input';

@Resolver(() => EstadisticaArquitecto)
export class EstadisticaArquitectoResolver {
  constructor(private readonly estadisticaArquitectoService: EstadisticaArquitectoService) {}

  @Mutation(() => EstadisticaArquitecto)
  createEstadisticaArquitecto(@Args('createEstadisticaArquitectoInput') createEstadisticaArquitectoInput: CreateEstadisticaArquitectoInput) {
    return this.estadisticaArquitectoService.create(createEstadisticaArquitectoInput);
  }

  @Query(() => [EstadisticaArquitecto], { name: 'estadisticaArquitecto' })
  findAll() {
    return this.estadisticaArquitectoService.findAll();
  }

  @Query(() => EstadisticaArquitecto, { name: 'estadisticaArquitecto' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.estadisticaArquitectoService.findOne(id);
  }

  @Mutation(() => EstadisticaArquitecto)
  updateEstadisticaArquitecto(@Args('updateEstadisticaArquitectoInput') updateEstadisticaArquitectoInput: UpdateEstadisticaArquitectoInput) {
    return this.estadisticaArquitectoService.update(updateEstadisticaArquitectoInput.id, updateEstadisticaArquitectoInput);
  }

  @Mutation(() => EstadisticaArquitecto)
  removeEstadisticaArquitecto(@Args('id', { type: () => Int }) id: number) {
    return this.estadisticaArquitectoService.remove(id);
  }
}
