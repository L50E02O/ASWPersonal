import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { KpisPlataformaService } from './kpis-plataforma.service';
import { KpisPlataforma } from './entities/kpis-plataforma.entity';
import { CreateKpisPlataformaInput } from './dto/create-kpis-plataforma.input';
import { UpdateKpisPlataformaInput } from './dto/update-kpis-plataforma.input';

@Resolver(() => KpisPlataforma)
export class KpisPlataformaResolver {
  constructor(private readonly kpisPlataformaService: KpisPlataformaService) {}


  @Query(() => KpisPlataforma, { name: 'kpisPlataforma' })
  kpisPlataforma() {
    return this.kpisPlataformaService.getKpis();
  }

}
