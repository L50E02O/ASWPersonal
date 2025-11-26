import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { RestClientModule } from "./rest-client/rest-client.module";
import { UsuarioResolver } from "./resolvers/usuario.resolver";
import { ConferenciaResolver } from "./resolvers/conferencia.resolver";
import { AgendaResolver } from "./resolvers/agenda.resolver";
import { EstadisticasResolver } from "./resolvers/estadisticas.resolver";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: false, // Apollo Playground deshabilitado
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Nueva interfaz de Apollo Studio
    }),
    RestClientModule,
  ],
  providers: [UsuarioResolver, ConferenciaResolver, AgendaResolver, EstadisticasResolver],
})
export class AppModule {}

