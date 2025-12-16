# Implementación de Webhooks y Serverless - Resumen

## ✅ Componentes Implementados

### 1. Webhook Publisher Service (NestJS + Bull/BullMQ)

**Ubicación**: 
- `microservicio-arquitecto/src/webhook/`
- `microservicio-verificacion/src/webhook/`

**Características**:
- ✅ Patrón Fanout (un evento genera múltiples webhooks)
- ✅ Firma HMAC-SHA256 para seguridad
- ✅ Retry con Exponential Backoff (6 intentos: 1min, 5min, 30min, 2h, 12h)
- ✅ Dead Letter Queue (DLQ) para webhooks fallidos
- ✅ Registro completo de intentos de entrega

**Archivos**:
- `webhook.service.ts`: Lógica principal de publicación
- `webhook.processor.ts`: Procesador de Bull para entregas
- `webhook.module.ts`: Módulo NestJS con configuración de Bull
- `dto/webhook-payload.dto.ts`: Tipos TypeScript para payloads

### 2. Edge Functions (Supabase)

#### Edge Function 1: `webhook-event-logger`
**URL**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-event-logger`

**Funcionalidad**:
- ✅ Validación de firma HMAC
- ✅ Verificación de timestamp (anti-replay, máximo 5 minutos)
- ✅ Verificación de idempotencia (deduplicación)
- ✅ Guardado de eventos en tabla `webhook_events`
- ✅ Retorna 200 OK con `event_id`

#### Edge Function 2: `webhook-external-notifier`
**URL**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-external-notifier`

**Funcionalidad**:
- ✅ Validación de firma HMAC
- ✅ Verificación de idempotencia con `processed_webhooks`
- ✅ Envío de notificaciones por correo electrónico (Resend o SendGrid)
- ✅ Registro de resultados
- ✅ Retorna 200 OK o 500 para retry

#### Edge Function 3: `webhook-dlq-replay`
**URL**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay`

**Funcionalidad**:
- ✅ Reenvío de webhooks desde DLQ
- ✅ Soporte para replay individual o batch
- ✅ Actualización de estado de deliveries

### 3. Esquema de Base de Datos (Supabase)

**Tablas creadas**:
- ✅ `webhook_subscriptions`: Gestión de suscripciones
- ✅ `webhook_deliveries`: Auditoría completa de entregas
- ✅ `webhook_events`: Eventos recibidos (Edge Function Logger)
- ✅ `processed_webhooks`: Control de idempotencia (Edge Function Notifier)

### 4. Integración en Microservicios

#### Microservicio Arquitecto
- ✅ Publica webhook `architect.registered` cuando se crea un arquitecto
- ✅ Integrado con WebhookService

#### Microservicio Verificación
- ✅ Publica webhook `verification.pending` cuando se crea una verificación pendiente
- ✅ Integrado con WebhookService

## 📋 Pasos para Configurar

### 1. Instalar Dependencias

```bash
# Microservicio Arquitecto
cd microservicio-arquitecto
npm install

# Microservicio Verificación
cd ../microservicio-verificacion
npm install
```

### 2. Configurar Variables de Entorno

Ver archivo `WEBHOOK_SETUP.md` para detalles completos.

**Variables necesarias**:
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_SERVICE_KEY`: Service Role Key de Supabase
- `REDIS_HOST` y `REDIS_PORT`: Para Bull/BullMQ
- `SERVICE_NAME`: Nombre del microservicio

### 3. Crear Suscripciones de Webhooks

Ejecutar en Supabase SQL Editor:

```sql
-- Suscripción para architect.registered
INSERT INTO webhook_subscriptions (
  event_type,
  subscriber_url,
  secret_key,
  retry_config,
  active
) VALUES (
  'architect.registered',
  'https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-event-logger',
  'your-secret-key-change-this',
  '{"max_attempts": 6, "backoff_intervals": [60, 300, 1800, 7200, 43200]}'::jsonb,
  true
);

-- Suscripción para verification.pending
INSERT INTO webhook_subscriptions (
  event_type,
  subscriber_url,
  secret_key,
  retry_config,
  active
) VALUES (
  'verification.pending',
  'https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-external-notifier',
  'your-secret-key-change-this',
  '{"max_attempts": 6, "backoff_intervals": [60, 300, 1800, 7200, 43200]}'::jsonb,
  true
);
```

### 4. Configurar Secrets de Edge Functions

En Supabase Dashboard → Edge Functions → Secrets:

**Para webhook-event-logger:**
- `WEBHOOK_SECRET`: Mismo secret usado en suscripciones

**Para webhook-external-notifier:**
- `WEBHOOK_SECRET`: Mismo secret usado en suscripciones
- `RESEND_API_KEY`: (Opcional) API key de Resend, O
- `SENDGRID_API_KEY`: (Opcional) API key de SendGrid
- `EMAIL_FROM`: Email remitente
- `EMAIL_TO`: Email destinatario (puede ser múltiple separado por comas)

## 🧪 Pruebas

### Probar Flujo Completo

1. **Crear un Arquitecto**:
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

2. **Verificar Webhooks**:
   - Revisar tabla `webhook_events` en Supabase (debería tener el evento `architect.registered`)
   - Revisar tabla `webhook_deliveries` (debería tener las entregas)
   - Si el servicio de email está configurado (Resend o SendGrid), deberías recibir un correo electrónico

3. **Verificar Verificación Pendiente**:
   - El microservicio B debería crear automáticamente una verificación pendiente
   - Se debería publicar webhook `verification.pending`

### Probar Resiliencia (DLQ)

1. **Simular fallo**: Detener temporalmente la Edge Function
2. **Crear evento**: El webhook fallará y se reintentará 6 veces
3. **Verificar DLQ**: Después de 6 intentos, el webhook debería estar en `status = 'dlq'`
4. **Replay**: Usar Edge Function `webhook-dlq-replay` para reenviar

## 📊 Monitoreo

### Consultas Útiles

```sql
-- Ver entregas recientes
SELECT * FROM webhook_deliveries 
ORDER BY created_at DESC 
LIMIT 20;

-- Ver estadísticas por estado
SELECT status, COUNT(*) 
FROM webhook_deliveries 
GROUP BY status;

-- Ver eventos recibidos
SELECT * FROM webhook_events 
ORDER BY processed_at DESC 
LIMIT 10;

-- Ver DLQ
SELECT * FROM webhook_deliveries 
WHERE status = 'dlq' 
ORDER BY created_at DESC;
```

## 🔐 Seguridad

- ✅ Todas las comunicaciones HTTP POST están firmadas con HMAC-SHA256
- ✅ Validación de timestamp (anti-replay attack, máximo 5 minutos)
- ✅ Idempotencia para prevenir procesamiento duplicado
- ✅ Secrets almacenados como variables de entorno

## 📚 Documentación Adicional

- `WEBHOOK_PAYLOAD_EXAMPLES.md`: Ejemplos de payloads JSON
- `WEBHOOK_SETUP.md`: Guía detallada de configuración

## 🎯 Estrategia Avanzada Implementada

**WEBHOOK FANOUT CON DEAD LETTER QUEUE (DLQ)**

✅ **Fanout Publisher**: Un evento genera múltiples webhooks (uno por suscriptor)
✅ **Retry con Exponential Backoff**: 6 intentos (1min, 5min, 30min, 2h, 12h)
✅ **Dead Letter Queue**: Después de 6 intentos → mensaje va a DLQ
✅ **Replay Mechanism**: Edge Function para reenviar webhooks desde DLQ

## 🚀 Próximos Pasos

1. Instalar dependencias: `npm install` en ambos microservicios
2. Configurar variables de entorno
3. Crear suscripciones en Supabase
4. Probar el flujo completo
5. Configurar Telegram (opcional) para notificaciones

