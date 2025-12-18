# Supabase Edge Functions

Este directorio contiene las 3 Edge Functions necesarias para el sistema de webhooks.

## 📁 Estructura

```
supabase-edge-functions/
├── webhook-event-logger/
│   └── index.ts          # Edge Function 1: Logger de eventos
├── webhook-external-notifier/
│   └── index.ts          # Edge Function 2: Notificador por email
├── webhook-dlq-replay/
│   └── index.ts          # Edge Function 3: Replay de DLQ
└── README.md             # Este archivo
```

## 🚀 Desplegar Edge Functions

### Opción 1: Usando Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login en Supabase
supabase login

# Link a tu proyecto
supabase link --project-ref hgqbcsvsaiwembplaknq

# Desplegar todas las funciones
supabase functions deploy webhook-event-logger
supabase functions deploy webhook-external-notifier
supabase functions deploy webhook-dlq-replay
```

### Opción 2: Desde Supabase Dashboard

1. Ve a: **Supabase Dashboard → Edge Functions**
2. Haz clic en **"Create a new function"**
3. Nombre: `webhook-event-logger`
4. Copia el contenido de `webhook-event-logger/index.ts`
5. Repite para las otras 2 funciones

## 🔧 Configurar Secrets

Cada Edge Function necesita secrets configurados en Supabase Dashboard:

### webhook-event-logger

```
SUPABASE_URL=https://hgqbcsvsaiwembplaknq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
WEBHOOK_SECRET=tu-webhook-secret
```

### webhook-external-notifier

```
SUPABASE_URL=https://hgqbcsvsaiwembplaknq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
WEBHOOK_SECRET=tu-webhook-secret
RESEND_API_KEY=re_xxxxxxxxxxxxx (opcional)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx (opcional)
EMAIL_FROM=onboarding@resend.dev (para pruebas)
EMAIL_TO=tu-email@example.com
```

### webhook-dlq-replay

```
SUPABASE_URL=https://hgqbcsvsaiwembplaknq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_ANON_KEY=tu-anon-key (opcional, usa SERVICE_ROLE_KEY si no se proporciona)
```

## 📋 URLs de las Funciones Desplegadas

Una vez desplegadas, las funciones estarán disponibles en:

- **Logger**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-event-logger`
- **Notifier**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-external-notifier`
- **DLQ Replay**: `https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay`

## 📚 Documentación

Para más información sobre cada función, consulta:

- **[PROPOSITO_WEBHOOKS.md](../PROPOSITO_WEBHOOKS.md)** - Explicación detallada de cada función
- **[WEBHOOK_SETUP.md](../WEBHOOK_SETUP.md)** - Guía de configuración completa
- **[DLQ_REPLAY_GUIDE.md](../DLQ_REPLAY_GUIDE.md)** - Guía de uso de DLQ Replay
- **[EMAIL_SETUP_GUIDE.md](../EMAIL_SETUP_GUIDE.md)** - Configuración de email

## ✅ Verificar Despliegue

Después de desplegar, puedes verificar que funcionan:

```bash
# Probar Logger (requiere webhook válido)
curl -X POST https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-event-logger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"event":"test","version":"1.0","id":"test-id","idempotency_key":"test-key","timestamp":"2025-01-01T00:00:00Z","metadata":{"source":"test"},"data":{}}'

# Probar DLQ Replay
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?limit=10" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 🔄 Actualizar Funciones

Para actualizar una función existente:

```bash
# Usando Supabase CLI
supabase functions deploy webhook-event-logger

# O desde el Dashboard, edita el código directamente
```

## 📝 Notas Importantes

- Todas las funciones usan **Deno runtime**
- Requieren **TypeScript** con tipos de Supabase
- Las funciones tienen **verify_jwt: true** por defecto (requieren autenticación)
- Los logs se pueden ver en **Supabase Dashboard → Edge Functions → [Function] → Logs**

