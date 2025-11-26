import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { AgendaController } from "./agenda.controller";
import { AgendaService } from "./agenda.service";
import { Agenda } from "../../../dominio/entities";
import { UsuarioModule } from "../usuario/usuario.module";
import { ConferenciaModule } from "../conferencia/conferencia.module";

@Module({
  imports: [TypeOrmModule.forFeature([Agenda]), UsuarioModule, ConferenciaModule, HttpModule],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}

