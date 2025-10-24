import { Module } from '@nestjs/common';
import { PerfilCompletoArquitectoService } from './perfil-completo-arquitecto.service';
import { PerfilCompletoArquitectoResolver } from './perfil-completo-arquitecto.resolver';
import { ServicioHTTPModule } from 'src/ServicioHTTP/servicioHTTP.module';

@Module({
  imports: [ServicioHTTPModule],
  providers: [PerfilCompletoArquitectoResolver, PerfilCompletoArquitectoService],
})
export class PerfilCompletoArquitectoModule {}
