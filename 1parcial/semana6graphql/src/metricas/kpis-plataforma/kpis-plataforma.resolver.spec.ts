import { Test, TestingModule } from '@nestjs/testing';
import { KpisPlataformaResolver } from './kpis-plataforma.resolver';
import { KpisPlataformaService } from './kpis-plataforma.service';

describe('KpisPlataformaResolver', () => {
  let resolver: KpisPlataformaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KpisPlataformaResolver, KpisPlataformaService],
    }).compile();

    resolver = module.get<KpisPlataformaResolver>(KpisPlataformaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
