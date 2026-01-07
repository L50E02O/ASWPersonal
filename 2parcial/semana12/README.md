# Semana 12 - Arquitectura de Microservicios con Webhooks y Serverless

---------------------------------------------------------
# 📹 Enlace del video de la práctica semana12-Practica Webhooks
https://youtu.be/71P2bLVDR2w
---------------------------------------------------------

## 📋 Descripción del Proyecto

Implementación de una arquitectura de microservicios **Event-Driven** con:
- **Entidad Maestra**: Arquitecto (Microservicio A)
- **Entidad Transaccional**: Verificación (Microservicio B)
- **API Gateway**: Punto de entrada REST
- **RabbitMQ**: Comunicación asíncrona entre microservicios
- **Redis**: Consumidor Idempotente y cola de trabajos (Bull)
- **Webhooks**: Sistema de notificaciones HTTP con HMAC
- **Serverless Functions**: Edge Functions en Supabase (Deno)

## 🏗️ Estructura del Proyecto

```
semana12/
├── api-gateway/                    # API Gateway (NestJS)
├── microservicio-arquitecto/       # Microservicio A - Entidad Maestra
├── microservicio-verificacion/     # Microservicio B - Entidad Transaccional
├── supabase-edge-functions/        # Edge Functions (Serverless)
│   ├── webhook-event-logger/       # Edge Function 1: Logger
│   ├── webhook-external-notifier/  # Edge Function 2: Notifier
│   └── webhook-dlq-replay/         # Edge Function 3: DLQ Replay
├── docker-compose.yml              # Orquestación de servicios
├── README.md                       # Este archivo
└── README_WEBHOOKS.md              # Guía completa de webhooks
```

## 🧩 Componentes

### 1. API Gateway
- Expone endpoints HTTP REST
- Enruta peticiones a los microservicios correspondientes vía RabbitMQ
- No tiene base de datos propia

### 2. Microservicio Arquitecto (Servicio A)
- Base de datos PostgreSQL independiente
- Publica eventos de dominio a través de RabbitMQ
- **Publica webhook `architect.registered`** cuando se crea un arquitecto
- Integrado con WebhookService (Bull/BullMQ para retry y DLQ)

### 3. Microservicio Verificación (Servicio B)
- Base de datos PostgreSQL independiente
- Se comunica con Microservicio A vía RabbitMQ
- Implementa Consumidor Idempotente con Redis
- **Publica webhook `verification.pending`** cuando se crea una verificación pendiente
- Integrado con WebhookService (Bull/BullMQ para retry y DLQ)

### 4. Supabase Edge Functions (Serverless)
- **webhook-event-logger**: Registra eventos en BD para auditoría
- **webhook-external-notifier**: Envía notificaciones por email
- **webhook-dlq-replay**: Reenvía webhooks fallidos desde DLQ

## 🔄 Eventos RabbitMQ

### Eventos Publicados por Microservicio A (Arquitecto)
- `arquitecto.creado` - Cuando se crea un nuevo arquitecto
- `arquitecto.actualizado` - Cuando se actualiza un arquitecto
- `arquitecto.verificado` - Cuando se verifica un arquitecto

### Eventos Publicados por Microservicio B (Verificación)
- `verificacion.solicitada` - Cuando se solicita una verificación
- `verificacion.procesada` - Cuando se procesa una verificación
- `verificacion.completada` - Cuando se completa una verificación

## 🔔 Webhooks Implementados

### Webhook 1: `architect.registered`
- **Origen**: Microservicio Arquitecto
- **Destino**: Edge Function `webhook-event-logger`
- **Propósito**: Auditoría y registro de eventos
- **Guarda en**: Tabla `webhook_events` en Supabase

### Webhook 2: `verification.pending`
- **Origen**: Microservicio Verificación
- **Destino**: Edge Function `webhook-external-notifier`
- **Propósito**: Notificaciones externas por email
- **Envía**: Email HTML formateado (Resend o SendGrid)

## 📦 Requisitos

- ✅ Node.js 18+
- ✅ Docker y Docker Compose
- ✅ PostgreSQL (vía Docker)
- ✅ RabbitMQ (vía Docker)
- ✅ Redis (vía Docker)
- ✅ Cuenta de Supabase (gratuita): https://supabase.com
- ✅ Cuenta de Resend o SendGrid (para emails): https://resend.com o https://sendgrid.com

## 🚀 Instalación Rápida

### 1. Instalar Dependencias

```bash
cd api-gateway && npm install
cd ../microservicio-arquitecto && npm install
cd ../microservicio-verificacion && npm install
```

### 2. Iniciar Servicios con Docker Compose

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL para Arquitecto (puerto 5433)
- PostgreSQL para Verificación (puerto 5434)
- RabbitMQ (puerto 5672, UI en http://localhost:15672)
- Redis (puerto 6379)

### 3. Ejecutar Migraciones

```bash
cd microservicio-arquitecto && npm run migration:run
cd ../microservicio-verificacion && npm run migration:run
```

### 4. Configurar Supabase y Webhooks

**📖 Ver guía completa:** [README_WEBHOOKS.md](./README_WEBHOOKS.md)

Resumen rápido:
1. Crear proyecto en Supabase
2. Crear suscripciones de webhooks en la tabla `webhook_subscriptions`
3. Configurar secrets en Edge Functions
4. Configurar email (Resend o SendGrid)

### 5. Configurar Variables de Entorno

Crea archivos `.env` en cada microservicio (ver `env.example` en cada carpeta):

**microservicio-arquitecto/.env:**
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=arquitecto_user
DB_PASSWORD=arquitecto_pass
DB_DATABASE=arquitecto_db
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
SERVICE_NAME=microservicio-arquitecto
```

**microservicio-verificacion/.env:**
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=verificacion_user
DB_PASSWORD=verificacion_pass
DB_DATABASE=verificacion_db
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
SERVICE_NAME=microservicio-verificacion
```

### 6. Iniciar Microservicios

```bash
# Terminal 1: API Gateway
cd api-gateway && npm run start:dev

# Terminal 2: Microservicio Arquitecto
cd microservicio-arquitecto && npm run start:dev

# Terminal 3: Microservicio Verificación
cd microservicio-verificacion && npm run start:dev
```

## 📡 Endpoints API Gateway

### Arquitectos
- `GET /arquitectos` - Listar arquitectos
- `GET /arquitectos/:id` - Obtener arquitecto por ID
- `POST /arquitectos` - Crear arquitecto (dispara webhook `architect.registered`)
- `PATCH /arquitectos/:id` - Actualizar arquitecto

### Verificaciones
- `GET /verificaciones` - Listar verificaciones
- `GET /verificaciones/:id` - Obtener verificación por ID
- `POST /verificaciones` - Crear solicitud de verificación
- `PATCH /verificaciones/:id` - Actualizar estado de verificación

## 🧪 Probar el Sistema

### Prueba Completa: Crear Arquitecto

```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "1234567890",
    "descripcion": "Arquitecto de prueba",
    "especialidades": "Diseño residencial",
    "ubicacion": "Quito, Ecuador",
    "usuario_id": "789e0123-e45b-67c8-d901-234567890123"
  }'
```

**Esto debería:**
1. ✅ Crear arquitecto en Microservicio A
2. ✅ Publicar evento RabbitMQ `arquitecto.creado`
3. ✅ Publicar webhook `architect.registered` → Edge Function Logger
4. ✅ Microservicio B crea verificación pendiente automáticamente
5. ✅ Publicar webhook `verification.pending` → Edge Function Notifier
6. ✅ Enviar email de notificación (si está configurado)

## 🏗️ Arquitectura Completa

```
                    ┌──────────┐
                    │ Cliente  │
                    └────┬─────┘
                         │ HTTP REST
                         ▼
                  ┌─────────────┐
                  │ API Gateway │
                  │  (Puerto    │
                  │    3000)    │
                  └──────┬──────┘
                         │ RabbitMQ (RPC)
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌─────────────────┐          ┌──────────────────┐
│ Microservicio A │          │ Microservicio B  │
│ (Arquitecto)    │          │ (Verificación)   │
│ Puerto 3001     │          │ Puerto 3002      │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         │ RabbitMQ (eventos)         │ RabbitMQ (eventos)
         │                            │
         ├─→ arquitecto.creado ───────┘
         │
         ├─→ Webhook architect.registered
         │   └─→ Edge Function Logger (Supabase)
         │       └─→ Guarda en webhook_events
         │
         └─→ Webhook verification.pending
             └─→ Edge Function Notifier (Supabase)
                 └─→ Envía email (Resend/SendGrid)
```

## ✨ Características Implementadas

### Arquitectura Base (Taller 1)
- ✅ **API Gateway** - Punto único de entrada REST
- ✅ **Microservicio Arquitecto** - Entidad Maestra con BD independiente
- ✅ **Microservicio Verificación** - Entidad Transaccional con BD independiente
- ✅ **RabbitMQ** - Comunicación asíncrona entre microservicios
- ✅ **Consumidor Idempotente** - Implementado con Redis
- ✅ **Eventos de Dominio** - Publicación y consumo de eventos
- ✅ **Docker Compose** - Orquestación de servicios
- ✅ **Migraciones TypeORM** - Gestión de esquema de base de datos

### Webhooks y Serverless (Taller 2)
- ✅ **Sistema de Webhooks** - Publicación segura con HMAC-SHA256
- ✅ **Webhook Registry** - Tablas en Supabase (subscriptions, deliveries, events)
- ✅ **Retry Logic** - Exponential backoff (6 intentos: 1min, 5min, 30min, 2h, 12h)
- ✅ **Dead Letter Queue (DLQ)** - Para webhooks que fallan después de todos los reintentos
- ✅ **Edge Functions** - 3 funciones serverless en Supabase (Deno)
- ✅ **Notificaciones por Email** - Integración con Resend/SendGrid
- ✅ **Auditoría Completa** - Registro de todos los eventos y entregas
- ✅ **Idempotencia** - Prevención de procesamiento duplicado

## 📚 Documentación

- **[README_WEBHOOKS.md](./README_WEBHOOKS.md)** - Guía completa de configuración y prueba de webhooks
- **[README-VIDEO.md](./README-VIDEO.md)** - Enlace al video de la práctica

## 🔍 Monitoreo

### Ver Webhooks en Supabase

```sql
-- Ver eventos recibidos
SELECT * FROM webhook_events ORDER BY processed_at DESC LIMIT 10;

-- Ver entregas de webhooks
SELECT event_type, status, attempt_number, http_status_code 
FROM webhook_deliveries 
ORDER BY created_at DESC LIMIT 10;

-- Ver DLQ
SELECT * FROM webhook_deliveries WHERE status = 'dlq' ORDER BY created_at DESC;
```

### Ver Logs

- **Microservicios**: Logs en consola cuando ejecutas `npm run start:dev`
- **Edge Functions**: Supabase Dashboard → Edge Functions → [Function] → Logs
- **RabbitMQ**: http://localhost:15672 (admin/admin123)

## 🆘 Troubleshooting

### Problemas Comunes

1. **Webhooks no se envían**
   - Verifica que Redis esté corriendo: `docker-compose ps`
   - Verifica que las suscripciones estén activas en Supabase
   - Revisa los logs de los microservicios

2. **Error "Invalid HMAC signature"**
   - Verifica que `WEBHOOK_SECRET` sea el mismo en todos los lugares
   - Revisa la tabla `webhook_subscriptions.secret_key`

3. **No recibo emails**
   - Verifica los secrets de la Edge Function `webhook-external-notifier`
   - Revisa la carpeta de spam
   - Verifica que el dominio esté verificado en Resend/SendGrid

**📖 Para más ayuda:** Ver sección de Troubleshooting en [README_WEBHOOKS.md](./README_WEBHOOKS.md)

## ✅ Checklist de Verificación

Antes de probar, verifica:

- [ ] Docker Compose corriendo (`docker-compose ps`)
- [ ] Dependencias instaladas (`npm install` en todos los servicios)
- [ ] Migraciones ejecutadas (`npm run migration:run`)
- [ ] Variables de entorno configuradas (`.env` en cada microservicio)
- [ ] Proyecto de Supabase creado
- [ ] Suscripciones de webhooks creadas en Supabase
- [ ] Secrets configurados en Edge Functions
- [ ] Email configurado (Resend o SendGrid) - opcional
- [ ] Microservicios corriendo (`npm run start:dev`)

## 🎯 Flujo Completo Esperado

```
1. POST /arquitectos (API Gateway)
   ↓
2. Microservicio A crea arquitecto
   ↓
3. Publica evento RabbitMQ 'arquitecto.creado'
   ↓
4. Publica webhook 'architect.registered' → Edge Function Logger
   │  └─→ Guarda en webhook_events (Supabase)
   ↓
5. Microservicio B escucha RabbitMQ 'arquitecto.creado'
   ↓
6. Crea verificación pendiente automáticamente
   ↓
7. Publica webhook 'verification.pending' → Edge Function Notifier
   │  └─→ Envía email de notificación
   ↓
8. Todo registrado en webhook_events y webhook_deliveries
```

## 📝 Notas Importantes

- **No existe comunicación HTTP directa** entre Microservicio A y B
- Toda comunicación crítica se realiza vía RabbitMQ
- Los webhooks son para notificaciones externas y auditoría
- El Consumidor Idempotente garantiza procesamiento único mediante claves de idempotencia almacenadas en Redis
- Los webhooks tienen retry automático con exponential backoff
- Los webhooks fallidos van a DLQ después de 6 intentos

---

**🚀 ¡Éxito con tu implementación!**

Para más detalles sobre webhooks, consulta: [README_WEBHOOKS.md](./README_WEBHOOKS.md)



