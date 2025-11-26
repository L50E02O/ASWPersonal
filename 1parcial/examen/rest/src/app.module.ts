import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioModule } from "./usuario/usuario.module";
import { ConferenciaModule } from "./conferencia/conferencia.module";
import { AgendaModule } from "./agenda/agenda.module";
import { NotificacionesModule } from "./notificaciones/notificaciones.module";
import { Usuario, Conferencia, Agenda } from "../../dominio/entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "conferencias.db",
      entities: [Usuario, Conferencia, Agenda],
      synchronize: true,
      logging: false,
    }),
    UsuarioModule,
    ConferenciaModule,
    AgendaModule,
    NotificacionesModule,
  ],
})
export class AppModule {}

