# Estructura del Proyecto - Semana 10

## Organización de Carpetas

```
semana10/
├── api-gateway/                    # API Gateway (NestJS)
│   ├── src/
│   │   ├── arquitecto/           # Módulo de Arquitecto
│   │   │   ├── dto/              # DTOs de Arquitecto
│   │   │   └── arquitecto.controller.ts
│   │   ├── verificacion/         # Módulo de Verificación
│   │   │   ├── dto/              # DTOs de Verificación
│   │   │   └── verificacion.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── microservicio-arquitecto/      # Microservicio A - Entidad Maestra
│   ├── src/
│   │   ├── arquitecto/           # Módulo de Arquitecto
│   │   │   ├── entities/         # Entidad TypeORM
│   │   │   ├── dto/              # DTOs
│   │   │   ├── arquitecto.controller.ts
│   │   │   ├── arquitecto.service.ts
│   │   │   └── arquitecto.module.ts
│   │   ├── rabbitmq/             # Servicio RabbitMQ
│   │   │   ├── rabbitmq.service.ts
│   │   │   └── rabbitmq.module.ts
│   │   ├── config/               # Configuración TypeORM
│   │   │   └── data-source.ts
│   │   ├── migrations/           # Migraciones de base de datos
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── microservicio-verificacion/    # Microservicio B - Entidad Transaccional
│   ├── src/
│   │   ├── verificacion/         # Módulo de Verificación
│   │   │   ├── entities/         # Entidad TypeORM
│   │   │   ├── dto/              # DTOs
│   │   │   ├── verificacion.controller.ts
│   │   │   ├── verificacion.service.ts
│   │   │   └── verificacion.module.ts
│   │   ├── rabbitmq/             # Servicio RabbitMQ
│   │   │   ├── rabbitmq.service.ts
│   │   │   └── rabbitmq.module.ts
│   │   ├── redis/                # Servicio Redis (Idempotencia)
│   │   │   ├── redis.service.ts
│   │   │   └── redis.module.ts
│   │   ├── config/               # Configuración TypeORM
│   │   │   └── data-source.ts
│   │   ├── migrations/           # Migraciones de base de datos
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/                       # Scripts de verificación
│   └── verificar-requisitos.js    # Verifica cumplimiento de requisitos
│
├── docker-compose.yml             # Orquestación de servicios
├── README.md                      # Documentación principal
├── GUIA_IMPLEMENTACION.md         # Guía detallada de implementación
└── ESTRUCTURA_PROYECTO.md         # Este archivo
```

## Descripción de Componentes

### API Gateway

**Responsabilidades:**
- Recibir peticiones HTTP REST del cliente
- Enrutar peticiones a los microservicios correspondientes vía RabbitMQ
- Validar datos de entrada
- Manejar errores y respuestas HTTP

**No tiene:**
- Base de datos propia
- Lógica de negocio compleja
- Acceso directo a bases de datos de microservicios

### Microservicio Arquitecto

**Responsabilidades:**
- Gestionar la entidad Arquitecto (CRUD)
- Publicar eventos de dominio cuando ocurren cambios
- Escuchar eventos de verificación completada
- Validar existencia de arquitectos para otros servicios

**Base de Datos:**
- PostgreSQL independiente
- Tabla: `arquitectos`

**Eventos que Publica:**
- `arquitecto.creado`
- `arquitecto.actualizado`
- `arquitecto.verificado`

**Eventos que Escucha:**
- `verificacion.completada`

### Microservicio Verificación

**Responsabilidades:**
- Gestionar la entidad Verificación (CRUD)
- Verificar existencia de arquitectos vía RabbitMQ
- Implementar Consumidor Idempotente con Redis
- Notificar al microservicio de Arquitecto cuando se completa una verificación

**Base de Datos:**
- PostgreSQL independiente
- Tabla: `verificaciones`

**Eventos que Publica:**
- `verificacion.solicitada`
- `verificacion.procesada`
- `verificacion.completada`

**Comunicación:**
- Envía mensajes síncronos a Microservicio A: `arquitecto.exists`
- No hay comunicación HTTP directa con Microservicio A

## Flujo de Datos

### Flujo 1: Crear Arquitecto

```
Cliente → API Gateway (HTTP) → RabbitMQ → Microservicio Arquitecto
                                              ↓
                                         Base de Datos Arquitecto
                                              ↓
                                         Publica: arquitecto.creado
```

### Flujo 2: Crear Verificación

```
Cliente → API Gateway (HTTP) → RabbitMQ → Microservicio Verificación
                                              ↓
                                         Verifica Idempotencia (Redis)
                                              ↓
                                         Envía: arquitecto.exists (RabbitMQ)
                                              ↓
                                         Microservicio Arquitecto responde
                                              ↓
                                         Crea Verificación en BD
                                              ↓
                                         Guarda Idempotencia (Redis)
                                              ↓
                                         Publica: verificacion.solicitada
```

### Flujo 3: Completar Verificación

```
Cliente → API Gateway (HTTP) → RabbitMQ → Microservicio Verificación
                                              ↓
                                         Actualiza estado en BD
                                              ↓
                                         Publica: verificacion.completada
                                              ↓
                                         Microservicio Arquitecto escucha
                                              ↓
                                         Actualiza arquitecto.verificado = true
```

## Tecnologías Utilizadas

- **NestJS**: Framework para microservicios
- **TypeORM**: ORM para PostgreSQL
- **RabbitMQ**: Message broker para comunicación asíncrona
- **Redis**: Almacenamiento para claves de idempotencia
- **PostgreSQL**: Base de datos para cada microservicio
- **Docker Compose**: Orquestación de servicios

## Patrones Implementados

1. **API Gateway Pattern**: Punto único de entrada
2. **Microservices Pattern**: Servicios independientes y desacoplados
3. **Event-Driven Architecture**: Comunicación mediante eventos
4. **Idempotent Consumer Pattern**: Prevención de procesamiento duplicado
5. **Database per Service**: Cada microservicio tiene su propia BD
6. **Message Queue Pattern**: Comunicación asíncrona vía RabbitMQ

