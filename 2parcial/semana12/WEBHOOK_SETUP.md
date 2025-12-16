# Configuración de Webhooks

## 1. Configurar Suscripciones de Webhooks en Supabase

Para que los microservicios publiquen webhooks, necesitas crear suscripciones en la tabla `webhook_subscriptions`.

### Suscripción para `architect.registered` (Edge Function Logger)

```sql
INSERT INTO webhook_subscriptions (
  event_type,
  subscriber_url,
  secret_key,
  retry_config,
  active
) VALUES (
  'architect.registered',
  'https://YOUR_PROJECT.supabase.co/functions/v1/webhook-event-logger',
  'your-secret-key-change-this',
  '{"max_attempts": 6, "backoff_intervals": [60, 300, 1800, 7200, 43200]}'::jsonb,
  true
);
```

### Suscripción para `verification.pending` (Edge Function Notifier)

```sql
INSERT INTO webhook_subscriptions (
  event_type,
  subscriber_url,
  secret_key,
  retry_config,
  active
) VALUES (
  'verification.pending',
  'https://YOUR_PROJECT.supabase.co/functions/v1/webhook-external-notifier',
  'your-secret-key-change-this',
  '{"max_attempts": 6, "backoff_intervals": [60, 300, 1800, 7200, 43200]}'::jsonb,
  true
);
```

## 2. Variables de Entorno para Microservicios

### Microservicio Arquitecto (.env)

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=arquitecto_user
DB_PASSWORD=arquitecto_pass
DB_DATABASE=arquitecto_db

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
RABBITMQ_EXCHANGE=arquitecto.exchange

# Redis (para Bull)
REDIS_HOST=localhost
REDIS_PORT=6379

# Supabase (para Webhooks)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SERVICE_NAME=microservicio-arquitecto
```

### Microservicio Verificación (.env)

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5434
DB_USER=verificacion_user
DB_PASSWORD=verificacion_pass
DB_DATABASE=verificacion_db

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
RABBITMQ_EXCHANGE=arquitecto.exchange

# Redis (para Bull y Idempotencia)
REDIS_HOST=localhost
REDIS_PORT=6379

# Supabase (para Webhooks)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SERVICE_NAME=microservicio-verificacionNAME
```

## 3. Variables de Entorno para Edge Functions

### Edge Function: webhook-event-logger

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEBHOOK_SECRET=your-secret-key-change-this
```

### Edge Function: webhook-external-notifier

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEBHOOK_SECRET=your-secret-key-change-this

# Opción 1: Usar Resend (Recomendado - más simple)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@tudominio.com
EMAIL_TO=destinatario@example.com

# Opción 2: Usar SendGrid (Alternativa)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# EMAIL_FROM=noreply@tudominio.com
# EMAIL_TO=destinatario@example.com
```

### Edge Function: webhook-dlq-replay

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Configurar Servicio de Email

La Edge Function soporta dos servicios de email. Elige uno:

### Opción 1: Resend (Recomendado - Más Simple)

1. Crear cuenta en [Resend](https://resend.com) (tier gratuito disponible)
2. Verificar tu dominio o usar el dominio de prueba de Resend
3. Obtener tu API Key desde el dashboard
4. Configurar en Supabase Edge Function Secrets:
   - `RESEND_API_KEY`: Tu API key de Resend
   - `EMAIL_FROM`: Email remitente (ej: `noreply@tudominio.com` o `onboarding@resend.dev` para pruebas)
   - `EMAIL_TO`: Email destinatario (puede ser múltiple separado por comas: `email1@example.com,email2@example.com`)

### Opción 2: SendGrid (Alternativa)

1. Crear cuenta en [SendGrid](https://sendgrid.com) (tier gratuito: 100 emails/día)
2. Verificar tu dominio o usar el dominio de prueba
3. Crear un API Key desde Settings → API Keys
4. Configurar en Supabase Edge Function Secrets:
   - `SENDGRID_API_KEY`: Tu API key de SendGrid
   - `EMAIL_FROM`: Email remitente
   - `EMAIL_TO`: Email destinatario (puede ser múltiple separado por comas)

### Nota sobre Variables de Entorno

- **EMAIL_FROM**: Debe ser un email verificado en tu servicio de email
- **EMAIL_TO**: Puede ser un solo email o múltiples separados por comas
- Solo necesitas configurar **una** de las opciones (Resend o SendGrid), no ambas

## 5. URLs de las Edge Functions

Una vez desplegadas, las URLs serán:

- **Logger**: `https://YOUR_PROJECT.supabase.co/functions/v1/webhook-event-logger`
- **Notifier**: `https://YOUR_PROJECT.supabase.co/functions/v1/webhook-external-notifier`
- **DLQ Replay**: `https://YOUR_PROJECT.supabase.co/functions/v1/webhook-dlq-replay`

## 6. Probar el Sistema

### Crear un Arquitecto (dispara `architect.registered`)

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

Esto debería:
1. Crear el arquitecto en el microservicio A
2. Publicar evento a RabbitMQ
3. El microservicio B crea una verificación pendiente
4. Se publica webhook `verification.pending` a Edge Function Notifier
5. Se publica webhook `architect.registered` a Edge Function Logger

## 7. Monitorear Entregas de Webhooks

```sql
-- Ver todas las entregas
SELECT * FROM webhook_deliveries ORDER BY created_at DESC LIMIT 10;

-- Ver entregas fallidas
SELECT * FROM webhook_deliveries WHERE status = 'failed' ORDER BY created_at DESC;

-- Ver DLQ
SELECT * FROM webhook_deliveries WHERE status = 'dlq' ORDER BY created_at DESC;

-- Ver eventos recibidos
SELECT * FROM webhook_events ORDER BY processed_at DESC LIMIT 10;
```

## 8. Reenviar desde DLQ

```bash
# Reenviar los 10 más antiguos de la DLQ
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/webhook-dlq-replay?limit=10" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Reenviar un delivery específico
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/webhook-dlq-replay?delivery_id=UUID" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

