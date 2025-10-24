import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticaArquitectoResolver } from './estadistica-arquitecto.resolver';
import { EstadisticaArquitectoService } from './estadistica-arquitecto.service';

describe('EstadisticaArquitectoResolver', () => {
  let resolver: EstadisticaArquitectoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadisticaArquitectoResolver, EstadisticaArquitectoService],
    }).compile();

    resolver = module.get<EstadisticaArquitectoResolver>(EstadisticaArquitectoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
