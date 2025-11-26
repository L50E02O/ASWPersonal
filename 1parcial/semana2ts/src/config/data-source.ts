import { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { Conferencia } from "../entities/Conferencia";
import { Pago } from "../entities/Pago";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "conferencias.db",
  synchronize: true,
  logging: false,
  entities: [Usuario, Conferencia, Pago],
  migrations: [],
  subscribers: [],
});

