import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "ep-broad-truth-adrin6h7-pooler.c-2.us-east-1.aws.neon.tech",
  port: 5432,
  username: "neondb_owner",
  password: "npg_IBYPjOH3J6Vc",
  database: "neondb",
  synchronize: false,
  logging: true,
  entities: ["src/entities/*.ts"],
  subscribers: [],
  migrations: [],
  ssl: {
    rejectUnauthorized: false
  }
});
