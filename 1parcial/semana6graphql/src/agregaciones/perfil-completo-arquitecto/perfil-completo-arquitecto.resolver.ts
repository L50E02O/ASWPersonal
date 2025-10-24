import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PerfilCompletoArquitectoService } from './perfil-completo-arquitecto.service';
import { PerfilCompletoArquitecto } from './entities/perfil-completo-arquitecto.entity';


@Resolver(() => PerfilCompletoArquitecto)
export class PerfilCompletoArquitectoResolver {
  constructor(private readonly arquitectoService: PerfilCompletoArquitectoService) {}

  @Query(() => PerfilCompletoArquitecto, { name: 'perfilCompletoArquitecto' })
  async perfilCompletoArquitecto(
    @Args('arquitectoId', { type: () => String }) arquitectoId: string,
  ): Promise<PerfilCompletoArquitecto> {
    return this.arquitectoService.obtenerPerfilCompleto(arquitectoId);
  }
}
