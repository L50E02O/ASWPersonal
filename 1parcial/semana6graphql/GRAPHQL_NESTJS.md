# GraphQL Gateway con NestJS - ArquiPro

Servicio GraphQL desarrollado en **NestJS** con **Apollo Server** que actúa como gateway de agregación sobre la API REST de Rails.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Implementación](#implementación)
- [Ejecución](#ejecución)
- [Queries Disponibles](#queries-disponibles)
- [Diferencias con Python/FastAPI](#diferencias-con-pythonfastapi)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Tecnologías

- **Node.js**: 18+ o 20+
- **NestJS**: Framework progresivo para Node.js
- **@nestjs/graphql**: Módulo GraphQL para NestJS
- **@nestjs/apollo**: Integración Apollo Server con NestJS
- **Apollo Server**: Servidor GraphQL
- **GraphQL**: Lenguaje de consultas
- **@nestjs/axios**: Cliente HTTP basado en Axios
- **TypeScript**: Lenguaje de programación

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (React/Vue)   │
└────────┬────────┘
         │ GraphQL Query
         ▼
┌─────────────────┐
│  GraphQL Server │ ◄── NestJS + Apollo
│  (NestJS)       │
└────────┬────────┘
         │ REST HTTP (axios)
         ▼
┌─────────────────┐
│   API REST      │
│   (Rails)       │
└─────────────────┘
```

### Patrón Gateway

Este servicio actúa como **capa de agregación** que:

1. **Consume** múltiples endpoints REST de Rails mediante Axios
2. **Combina** datos de diferentes recursos en una sola query GraphQL
3. **Transforma** respuestas REST en tipos GraphQL estructurados
4. **Optimiza** reduciendo el número de peticiones HTTP desde el frontend

---

## 📋 Requisitos Previos

- **Node.js** 18+ o 20+ → [Descargar Node.js](https://nodejs.org/)
- **npm** o **yarn** (incluido con Node.js)
- **API REST funcionando** en `http://localhost:3000`

---

## 🚀 Instalación

### 1. Crear proyecto NestJS

```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# Crear nuevo proyecto
nest new graphql-gateway
cd graphql-gateway
```

### 2. Instalar dependencias GraphQL

```bash
# GraphQL y Apollo Server
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql

# Cliente HTTP
npm install @nestjs/axios axios

# Variables de entorno
npm install @nestjs/config

# Validación
npm install class-validator class-transformer
```

### 3. Generar recursos con CLI

Usaremos `nest g resource` para generar automáticamente los módulos, resolvers y servicios:

```bash
# Generar recurso para Agregación (queries complejas)
nest g resource agregacion --no-spec

# Cuando pregunte "What transport layer do you use?", selecciona: GraphQL (code first)
# Cuando pregunte "Would you like to generate CRUD entry points?", selecciona: No

# Generar recurso para Métricas
nest g resource metricas --no-spec
# Selecciona: GraphQL (code first), No CRUD

# Generar recurso para Búsqueda
nest g resource busqueda --no-spec
# Selecciona: GraphQL (code first), No CRUD

# Generar módulo para REST Client (servicio compartido)
nest g module common/rest-client
nest g service common/rest-client --no-spec
```

Esto generará automáticamente:
- `src/agregacion/` con `agregacion.module.ts`, `agregacion.resolver.ts`, `agregacion.service.ts`
- `src/metricas/` con `metricas.module.ts`, `metricas.resolver.ts`, `metricas.service.ts`
- `src/busqueda/` con `busqueda.module.ts`, `busqueda.resolver.ts`, `busqueda.service.ts`
- `src/common/rest-client/` con `rest-client.module.ts`, `rest-client.service.ts`

---

## 📁 Estructura del Proyecto

Después de ejecutar los comandos `nest g resource`, la estructura quedará así:

```
graphql-gateway/
├── src/
│   ├── main.ts                          # Punto de entrada
│   ├── app.module.ts                    # Módulo raíz
│   │
│   ├── common/                          # Servicios compartidos
│   │   └── rest-client/
│   │       ├── rest-client.service.ts   # 🔧 Servicio HTTP para consumir Rails
│   │       └── rest-client.module.ts
│   │
│   ├── types/                           # 📦 Tipos GraphQL base (crear manualmente)
│   │   ├── usuario.type.ts
│   │   ├── arquitecto.type.ts
│   │   ├── cliente.type.ts
│   │   ├── proyecto.type.ts
│   │   ├── conversacion.type.ts
│   │   ├── mensaje.type.ts
│   │   ├── avance.type.ts
│   │   ├── valoracion.type.ts
│   │   └── incidencia.type.ts
│   │
│   ├── models/                          # 🎯 Tipos complejos (crear manualmente)
│   │   ├── perfil-completo-arquitecto.model.ts --- neysser
│   │   ├── dashboard-proyecto.model.ts --- neysser
│   │   ├── historial-conversacion.model.ts --- neysser
│   │   ├── estadisticas-arquitecto.model.ts
│   │   ├── kpis-plataforma.model.ts
│   │   └── metricas-proyecto.model.ts
│   │
│   ├── agregacion/                      # 📊 Generado con nest g resource
│   │   ├── agregacion.module.ts
│   │   ├── agregacion.resolver.ts       # Queries: perfil, dashboard, historial
│   │   ├── agregacion.service.ts        # Lógica de negocio
│   │   └── dto/
│   │       └── (inputs si son necesarios)
│   │
│   ├── metricas/                        # 📈 Generado con nest g resource
│   │   ├── metricas.module.ts
│   │   ├── metricas.resolver.ts         # Queries: estadisticas, kpis, metricas
│   │   ├── metricas.service.ts
│   │   └── dto/
│   │
│   ├── busqueda/                        # 🔍 Generado con nest g resource
│   │   ├── busqueda.module.ts
│   │   ├── busqueda.resolver.ts         # Queries: buscar arquitectos/proyectos/conversaciones
│   │   ├── busqueda.service.ts
│   │   └── dto/
│   │       ├── buscar-arquitectos.input.ts
│   │       ├── buscar-proyectos.input.ts
│   │       └── buscar-conversaciones.input.ts
│   │
│   └── schema.gql                       # Schema generado automáticamente
│
├── .env                                 # Variables de entorno
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### Archivos Generados Automáticamente (nest g resource)

✅ **Módulos**: `agregacion.module.ts`, `metricas.module.ts`, `busqueda.module.ts`  
✅ **Resolvers**: `agregacion.resolver.ts`, `metricas.resolver.ts`, `busqueda.resolver.ts`  
✅ **Services**: `agregacion.service.ts`, `metricas.service.ts`, `busqueda.service.ts`  
✅ **Carpetas DTO**: Para inputs de GraphQL

### Archivos a Crear Manualmente

📝 **Types (9 archivos)**: Tipos base que mapean 1:1 con Rails  
📝 **Models (6 archivos)**: Tipos complejos para queries agregadas  
📝 **REST Client**: Servicio para comunicación con Rails API

---

## ⚙️ Configuración

### 1. Configurar `.env`

```env
# API REST
REST_API_BASE_URL=http://localhost:3000/api/v1

# Puerto GraphQL
PORT=8000

# Modo
NODE_ENV=development
```

### 2. Configurar `app.module.ts`

Edita `src/app.module.ts` para configurar GraphQL y los módulos generados:

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

// Módulos generados con nest g resource
import { RestClientModule } from './common/rest-client/rest-client.module';
import { AgregacionModule } from './agregacion/agregacion.module';
import { MetricasModule } from './metricas/metricas.module';
import { BusquedaModule } from './busqueda/busqueda.module';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // GraphQL con Apollo Server
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // GraphQL Playground en /graphql
      context: ({ req }) => ({ req }),
    }),
    
    // Módulos de la aplicación (generados automáticamente)
    RestClientModule,
    AgregacionModule,
    MetricasModule,
    BusquedaModule,
  ],
})
export class AppModule {}
```

**Nota**: Los módulos `AgregacionModule`, `MetricasModule` y `BusquedaModule` fueron generados automáticamente con `nest g resource` y ya están registrados.

---

## 💻 Implementación

### 1. Servicio REST Client

**`src/common/rest-client/rest-client.service.ts`**

```typescript
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RestClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'REST_API_BASE_URL',
      'http://localhost:3000/api/v1',
    );
  }

  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.baseUrl}${endpoint}`),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`❌ Error en REST: ${endpoint}`, error.message);
        throw new HttpException(
          error.response?.data || 'Error al consumir API REST',
          error.response?.status || 500,
        );
      }
      throw error;
    }
  }

  // Usuarios
  async getUsuario(id: string) {
    return this.request(`/usuarios/${id}`);
  }

  async getUsuarios() {
    return this.request('/usuarios');
  }

  // Arquitectos
  async getArquitecto(id: string) {
    return this.request(`/arquitectos/${id}`);
  }

  async getArquitectos(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/arquitectos${query}`);
  }

  // Clientes
  async getCliente(id: string) {
    return this.request(`/clientes/${id}`);
  }

  // Proyectos
  async getProyecto(id: string) {
    return this.request(`/proyectos/${id}`);
  }

  async getProyectos(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/proyectos${query}`);
  }

  // Conversaciones
  async getConversacion(id: string) {
    return this.request(`/conversaciones/${id}`);
  }

  async getConversaciones(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/conversaciones${query}`);
  }

  // Mensajes
  async getMensajes(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/mensajes${query}`);
  }

  // Avances
  async getAvances(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/avances${query}`);
  }

  // Valoraciones
  async getValoraciones(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/valoraciones${query}`);
  }

  // Incidencias
  async getIncidencias(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/incidencias${query}`);
  }
}
```

**`src/common/rest-client/rest-client.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from './rest-client.service';

@Module({
  imports: [HttpModule],
  providers: [RestClientService],
  exports: [RestClientService],
})
export class RestClientModule {}
```

---

### 2. Tipos GraphQL Base

**`src/types/usuario.type.ts`**

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UsuarioType {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field()
  email: string;

  @Field()
  estado_cuenta: string;

  @Field()
  rol: string;

  @Field({ nullable: true })
  fecha_registro?: string;

  @Field({ nullable: true })
  foto_perfil?: string;
}
```

**`src/types/arquitecto.type.ts`**

```typescript
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ArquitectoType {
  @Field(() => ID)
  id: string;

  @Field()
  cedula: string;

  @Field(() => Float)
  valoracion_prom_proyecto: number;

  @Field()
  descripcion: string;

  @Field()
  especialidades: string;

  @Field()
  ubicacion: string;

  @Field()
  verificado: boolean;

  @Field(() => Int)
  vistas_perfil: number;

  @Field(() => ID)
  usuario_id: string;
}
```

**`src/types/proyecto.type.ts`**

```typescript
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ProyectoType {
  @Field(() => ID)
  id: string;

  @Field()
  titulo_proyecto: string;

  @Field(() => Float)
  valoracion_promedio: number;

  @Field()
  descripcion: string;

  @Field()
  tipo_proyecto: string;

  @Field()
  fecha_publicacion: string;

  @Field(() => ID)
  arquitecto_id: string;

  @Field(() => ID, { nullable: true })
  cliente_id?: string;

  @Field(() => ID, { nullable: true })
  conversacion_id?: string;
}
```

**`src/types/mensaje.type.ts`**

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MensajeType {
  @Field(() => ID)
  id: string;

  @Field()
  contenido: string;

  @Field()
  fecha_envio: string;

  @Field()
  leido: boolean;

  @Field(() => ID)
  conversacion_id: string;

  @Field(() => ID)
  usuario_emisor_id: string;
}
```

**`src/types/avance.type.ts`**

```typescript
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class AvanceType {
  @Field(() => ID)
  id: string;

  @Field()
  descripcion: string;

  @Field(() => Float)
  porcentaje_avance: number;

  @Field()
  fecha: string;

  @Field(() => ID)
  proyecto_id: string;
}
```

**`src/types/valoracion.type.ts`**

```typescript
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ValoracionType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  calificacion: number;

  @Field()
  comentario: string;

  @Field()
  fecha: string;

  @Field(() => ID)
  cliente_id: string;

  @Field(() => ID)
  proyecto_id: string;
}
```

---

### 3. Tipos Complejos Personalizados

**`src/graphql-types/perfil-completo-arquitecto.type.ts`**

```typescript
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ArquitectoType } from '../types/arquitecto.type';
import { UsuarioType } from '../types/usuario.type';
import { ProyectoType } from '../types/proyecto.type';

@ObjectType()
export class PerfilCompletoArquitecto {
  @Field(() => ArquitectoType)
  arquitecto: ArquitectoType;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => [ProyectoType])
  proyectos: ProyectoType[];

  @Field(() => Int)
  total_proyectos: number;

  @Field(() => Float)
  valoracion_promedio: number;
}
```

**`src/graphql-types/historial-conversacion.type.ts`**

```typescript
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ConversacionType } from '../types/conversacion.type';
import { ClienteType } from '../types/cliente.type';
import { ArquitectoType } from '../types/arquitecto.type';
import { UsuarioType } from '../types/usuario.type';
import { MensajeType } from '../types/mensaje.type';

@ObjectType()
export class HistorialConversacion {
  @Field(() => ConversacionType)
  conversacion: ConversacionType;

  @Field(() => ClienteType)
  cliente: ClienteType;

  @Field(() => UsuarioType)
  cliente_usuario: UsuarioType;

  @Field(() => ArquitectoType)
  arquitecto: ArquitectoType;

  @Field(() => UsuarioType)
  arquitecto_usuario: UsuarioType;

  @Field(() => [MensajeType])
  mensajes: MensajeType[];

  @Field(() => Int)
  total_mensajes: number;

  @Field(() => Int)
  mensajes_no_leidos: number;
}
```

**`src/graphql-types/kpis-plataforma.type.ts`**

```typescript
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UsuariosPorRol {
  @Field()
  rol: string;

  @Field(() => Int)
  cantidad: number;
}

@ObjectType()
export class KPIsPlataforma {
  @Field(() => Int)
  total_usuarios: number;

  @Field(() => [UsuariosPorRol])
  usuarios_por_rol: UsuariosPorRol[];

  @Field(() => Int)
  total_proyectos: number;

  @Field(() => Int)
  total_arquitectos: number;

  @Field(() => Int)
  total_clientes: number;
}
```

---

### 3.1. Input Types (DTOs para Búsquedas)

Los **Input Types** son necesarios para las queries de búsqueda que aceptan múltiples parámetros opcionales. Se crean en la carpeta `dto/` de cada módulo.

**`src/busqueda/dto/buscar-arquitectos.input.ts`**

```typescript
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class BuscarArquitectosInput {
  @Field({ nullable: true })
  especialidad?: string;

  @Field(() => Float, { nullable: true })
  valoracion_minima?: number;

  @Field({ nullable: true })
  ubicacion?: string;

  @Field({ nullable: true })
  verificado?: boolean;
}
```

**`src/busqueda/dto/buscar-proyectos.input.ts`**

```typescript
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class BuscarProyectosInput {
  @Field({ nullable: true })
  tipo_proyecto?: string;

  @Field({ nullable: true })
  arquitecto_id?: string;

  @Field({ nullable: true })
  cliente_id?: string;

  @Field(() => Float, { nullable: true })
  valoracion_minima?: number;

  @Field({ nullable: true })
  fecha_desde?: string;

  @Field({ nullable: true })
  fecha_hasta?: string;
}
```

**`src/busqueda/dto/buscar-conversaciones.input.ts`**

```typescript
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BuscarConversacionesInput {
  @Field({ nullable: true })
  cliente_id?: string;

  @Field({ nullable: true })
  arquitecto_id?: string;

  @Field({ nullable: true })
  fecha_desde?: string;

  @Field({ nullable: true })
  solo_con_no_leidos?: boolean;
}
```

**Uso en Resolvers:**

```typescript
// src/busqueda/busqueda.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { BusquedaService } from './busqueda.service';
import { BuscarArquitectosInput } from './dto/buscar-arquitectos.input';
import { PerfilCompletoArquitecto } from '../models/perfil-completo-arquitecto.model';

@Resolver()
export class BusquedaResolver {
  constructor(private readonly busquedaService: BusquedaService) {}

  @Query(() => [PerfilCompletoArquitecto])
  async buscarArquitectos(
    @Args('filtros', { nullable: true }) filtros?: BuscarArquitectosInput,
  ) {
    return this.busquedaService.buscarArquitectos(filtros);
  }
}
```

**Alternativa sin Input Types (parámetros individuales):**

Si prefieres no usar Input Types para queries simples:

```typescript
@Query(() => [PerfilCompletoArquitecto])
async buscarArquitectos(
  @Args('especialidad', { nullable: true }) especialidad?: string,
  @Args('valoracionMinima', { type: () => Float, nullable: true }) valoracionMinima?: number,
  @Args('verificado', { nullable: true }) verificado?: boolean,
) {
  return this.busquedaService.buscarArquitectos({ 
    especialidad, 
    valoracion_minima: valoracionMinima, 
    verificado 
  });
}
```

---

### 4. Implementar Resolvers

El archivo `src/agregacion/agregacion.resolver.ts` fue generado automáticamente. Ahora lo editamos para agregar las queries:

**`src/agregacion/agregacion.resolver.ts`**

```typescript
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AgregacionService } from './agregacion.service';
import { PerfilCompletoArquitecto } from '../models/perfil-completo-arquitecto.model';
import { HistorialConversacion } from '../models/historial-conversacion.model';
import { DashboardProyecto } from '../models/dashboard-proyecto.model';

@Resolver()
export class AgregacionResolver {
  constructor(private readonly agregacionService: AgregacionService) {}

  @Query(() => PerfilCompletoArquitecto, { 
    nullable: true,
    description: 'Obtiene el perfil completo de un arquitecto con sus proyectos'
  })
  async perfilCompletoArquitecto(
    @Args('arquitectoId', { type: () => ID }) arquitectoId: string,
  ): Promise<PerfilCompletoArquitecto | null> {
    return this.agregacionService.getPerfilCompleto(arquitectoId);
  }

  @Query(() => DashboardProyecto, {
    nullable: true,
    description: 'Obtiene el dashboard completo de un proyecto'
  })
  async dashboardProyecto(
    @Args('proyectoId', { type: () => ID }) proyectoId: string,
  ): Promise<DashboardProyecto | null> {
    return this.agregacionService.getDashboard(proyectoId);
  }

  @Query(() => HistorialConversacion, { 
    nullable: true,
    description: 'Obtiene el historial completo de una conversación'
  })
  async historialConversacion(
    @Args('conversacionId', { type: () => ID }) conversacionId: string,
  ): Promise<HistorialConversacion | null> {
    return this.agregacionService.getHistorialConversacion(conversacionId);
  }
}
```

**Nota**: La lógica completa va en `src/agregacion/agregacion.service.ts` (ver siguiente sección).

El módulo `src/agregacion/agregacion.module.ts` ya fue generado por `nest g resource` y solo necesitas agregar la importación de `RestClientModule`:

```typescript
import { Module } from '@nestjs/common';
import { AgregacionResolver } from './agregacion.resolver';
import { AgregacionService } from './agregacion.service';
import { RestClientModule } from '../common/rest-client/rest-client.module';

@Module({
  imports: [RestClientModule],  // Agregar esta línea
  providers: [AgregacionResolver, AgregacionService],
})
export class AgregacionModule {}
```

---

### 5. Implementar Services (Lógica en capa de servicio)

El patrón NestJS separa resolvers (entrada GraphQL) de services (lógica). Edita `src/agregacion/agregacion.service.ts`:

**`src/agregacion/agregacion.service.ts`** (fragmento simplificado)

```typescript
import { Injectable } from '@nestjs/common';
import { RestClientService } from '../common/rest-client/rest-client.service';
import { PerfilCompletoArquitecto } from '../models/perfil-completo-arquitecto.model';

@Injectable()
export class AgregacionService {
  constructor(private readonly restClient: RestClientService) {}

  async getPerfilCompleto(arquitectoId: string): Promise<PerfilCompletoArquitecto | null> {
    // Obtener arquitecto (incluye usuario anidado del serializer de Rails)
    const arqData = await this.restClient.getArquitecto(arquitectoId);
    const usuarioData = arqData.usuario || {};

    // Mapear a tipos GraphQL...
    // (ver código completo en repositorio)
    
    return {
      arquitecto: /* ... */,
      usuario: /* ... */,
      proyectos: /* ... */,
      total_proyectos: /* ... */,
      valoracion_promedio: /* ... */,
    };
  }

  // Implementar: getHistorialConversacion, getDashboard...
}
```

**Tip**: El service contiene toda la lógica de transformación de datos REST → GraphQL. El resolver solo delega.

---

### 5. Punto de Entrada

**`src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8000);
  
  // CORS (si el frontend está en otro puerto)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });
  
  await app.listen(port);
  console.log(`🚀 GraphQL Gateway corriendo en http://localhost:${port}/graphql`);
}
bootstrap();
```

---

## ▶️ Ejecución

### Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run start:dev
```

El servidor estará disponible en:
- **GraphQL Playground**: http://localhost:8000/graphql

### Producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

---

## 🔌 Queries Disponibles

Las mismas 9 queries que en la versión Python/FastAPI:

### 1. Agregación

```graphql
# Perfil completo de arquitecto
query {
  perfilCompletoArquitecto(arquitectoId: "123") {
    arquitecto {
      cedula
      especialidades
    }
    usuario {
      nombre
      apellido
      email
    }
    proyectos {
      titulo_proyecto
      estado_proyecto
    }
    total_proyectos
    valoracion_promedio
  }
}

# Historial de conversación
query {
  historialConversacion(conversacionId: "789") {
    conversacion {
      fecha
    }
    cliente {
      cedula
    }
    cliente_usuario {
      nombre
    }
    arquitecto {
      especialidades
    }
    mensajes {
      contenido
      fecha_envio
      leido
    }
    total_mensajes
    mensajes_no_leidos
  }
}
```

### 2. Métricas

```graphql
# KPIs de la plataforma
query {
  kpisPlataforma {
    total_usuarios
    usuarios_por_rol {
      rol
      cantidad
    }
    total_proyectos
    total_arquitectos
    total_clientes
  }
}
```

---

## 🔄 Diferencias con Python/FastAPI

| Aspecto | Python/FastAPI | NestJS |
|---------|----------------|--------|
| **Lenguaje** | Python 3.11+ | TypeScript/Node.js |
| **Framework** | FastAPI + Strawberry | NestJS + Apollo Server |
| **Decoradores** | `@strawberry.type` | `@ObjectType()`, `@Field()` |
| **Cliente HTTP** | `httpx` async | `@nestjs/axios` (rxjs) |
| **Schema** | Code-first (Strawberry) | Code-first (decoradores) |
| **Módulos** | Archivos Python | Módulos NestJS (`@Module()`) |
| **Inyección dependencias** | Manual | Automática (DI de NestJS) |
| **Tipos** | Python type hints | TypeScript interfaces/types |
| **Async/Await** | `async def` | `async function` |
| **Validación** | Manual | `class-validator` integrado |

---

## 🐛 Troubleshooting

### Error: `Cannot find module '@nestjs/graphql'`

**Solución:**
```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

---

### Error: `Connection refused to localhost:3000`

**Causa:** La API REST no está corriendo.

**Solución:**
```bash
cd c:\Users\leoan\Desktop\arqui-pro\backend\APIREST
rails server
```

---

### Error: `Cannot determine GraphQL output type for perfilCompletoArquitecto`

**Causa:** Falta el decorador `@Field()` en algún campo del tipo de retorno.

**Solución:** Verifica que todos los campos en `@ObjectType()` tengan `@Field()`.

---

### Error: Schema no se genera automáticamente

**Causa:** `autoSchemaFile` mal configurado.

**Solución:** Verifica en `app.module.ts`:
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
})
```

---

### Playground no aparece

**Solución:** Asegúrate de tener `playground: true` en `GraphQLModule.forRoot()`.

---

## 📚 Recursos Adicionales

- [NestJS GraphQL Docs](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TypeGraphQL (alternativa)](https://typegraphql.com/)
- [NestJS Axios](https://docs.nestjs.com/techniques/http-module)

---

## 🎯 Próximos Pasos

1. **Implementar las 6 queries restantes**: `dashboardProyecto`, `estadisticasArquitecto`, `metricasProyecto`, y las 3 búsquedas
2. **Agregar caché**: Usar `@nestjs/cache-manager` para cachear respuestas
3. **Agregar DataLoader**: Optimizar N+1 queries con `dataloader`
4. **Testing**: Escribir tests con `@nestjs/testing`
5. **Documentación**: Agregar comentarios JSDoc a los resolvers
6. **Validación**: Usar `class-validator` en DTOs de entrada
7. **Logging**: Integrar Winston o Pino para logs estructurados

---

## 📄 Licencia

Proyecto desarrollado para ArquiPro © 2025
