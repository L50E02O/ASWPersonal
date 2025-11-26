import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { Usuario } from "../../../dominio/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), HttpModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}

