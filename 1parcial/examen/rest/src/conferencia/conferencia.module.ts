import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ConferenciaController } from "./conferencia.controller";
import { ConferenciaService } from "./conferencia.service";
import { Conferencia } from "../../../dominio/entities";
import { UsuarioModule } from "../usuario/usuario.module";

@Module({
  imports: [TypeOrmModule.forFeature([Conferencia]), UsuarioModule, HttpModule],
  controllers: [ConferenciaController],
  providers: [ConferenciaService],
  exports: [ConferenciaService],
})
export class ConferenciaModule {}

