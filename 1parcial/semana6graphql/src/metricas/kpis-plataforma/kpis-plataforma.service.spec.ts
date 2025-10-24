import { Test, TestingModule } from '@nestjs/testing';
import { KpisPlataformaService } from './kpis-plataforma.service';

describe('KpisPlataformaService', () => {
  let service: KpisPlataformaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KpisPlataformaService],
    }).compile();

    service = module.get<KpisPlataformaService>(KpisPlataformaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
