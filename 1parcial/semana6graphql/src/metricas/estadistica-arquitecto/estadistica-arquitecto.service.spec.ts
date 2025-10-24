import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticaArquitectoService } from './estadistica-arquitecto.service';

describe('EstadisticaArquitectoService', () => {
  let service: EstadisticaArquitectoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadisticaArquitectoService],
    }).compile();

    service = module.get<EstadisticaArquitectoService>(EstadisticaArquitectoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
