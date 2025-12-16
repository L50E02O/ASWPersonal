# Guía: Reenviar Webhooks desde DLQ

## ¿Qué es la DLQ?

La **Dead Letter Queue (DLQ)** es una cola especial donde se almacenan webhooks que fallaron después de todos los intentos de retry (6 intentos con exponential backoff).

## ¿Cuándo usar el Replay?

Usa la función de replay cuando:
- ✅ Un webhook falló después de 6 intentos y está en DLQ
- ✅ El problema que causó el fallo ya fue resuelto (ej: Edge Function estaba caída, ahora está activa)
- ✅ Quieres recuperar webhooks que se perdieron temporalmente

## Configuración Requerida

### 1. Configurar Secret en Edge Function

La función `webhook-dlq-replay` necesita el anon key para autenticarse al reenviar webhooks:

1. Ve a: **Supabase Dashboard → Edge Functions → `webhook-dlq-replay` → Secrets**
2. Agrega:
   ```
   SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

**Obtener el Anon Key:**
- Supabase Dashboard → Settings → API
- Copia el **anon/public key** (el que empieza con `eyJ...` o `sb_publishable_...`)

### 2. Obtener tu Anon Key

Puedes obtenerlo de dos formas:

**Opción A: Desde Supabase Dashboard**
```
Settings → API → anon/public key
```

**Opción B: Desde el código (ya lo tienes)**
```typescript
// En tus archivos .env o código
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Uso de la Función

### Replay Batch (Múltiples Webhooks)

Reenvía los N webhooks más antiguos de la DLQ:

```bash
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncWJjc3ZzYWl3ZW1icGxha25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTU1MDEsImV4cCI6MjA4MTQ3MTUwMX0.VR43BAijAnRrN6yYEVFefGnoax6p0zfRT0u-NGl-uzU" \
  -H "Content-Type: application/json"
```

**Respuesta exitosa:**
```json
{
  "message": "DLQ replay completed",
  "total": 2,
  "success": 2,
  "failures": 0,
  "results": [
    {
      "delivery_id": "80e9dcac-daf6-42f3-9f9b-3c010a599f1d",
      "success": true,
      "error": null
    }
  ],
  "request_id": "...",
  "processing_time_ms": 500
}
```

### Replay Individual (Un Webhook Específico)

Reenvía un webhook específico por su ID:

```bash
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?delivery_id=80e9dcac-daf6-42f3-9f9b-3c010a599f1d" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Solución de Error 401

Si recibes `401: Unauthorized`:

### Problema 1: Falta Header de Autorización

**Error:**
```json
{
  "error": "Unauthorized",
  "message": "Missing authorization header"
}
```

**Solución:**
Agrega el header `Authorization` con tu anon key:
```bash
-H "Authorization: Bearer YOUR_ANON_KEY"
```

### Problema 2: SUPABASE_ANON_KEY no configurado en Secrets

**Error en logs:**
```
[WARN] No se encontró SUPABASE_ANON_KEY, el replay puede fallar con 401
```

**Solución:**
1. Ve a: Supabase Dashboard → Edge Functions → `webhook-dlq-replay` → Secrets
2. Agrega: `SUPABASE_ANON_KEY=tu-anon-key`

### Problema 3: Anon Key Incorrecto

**Error:**
```json
{
  "delivery_id": "...",
  "success": false,
  "error": "401: Unauthorized"
}
```

**Solución:**
- Verifica que estés usando el **anon/public key**, no el service_role key
- El anon key debe tener permisos para llamar a otras Edge Functions
- Verifica que el key no esté deshabilitado en Supabase Dashboard

## Verificar Deliveries en DLQ

Antes de hacer replay, verifica qué hay en la DLQ:

```sql
-- Ver todos los deliveries en DLQ
SELECT 
  id,
  event_type,
  subscriber_url,
  attempt_number,
  error_message,
  created_at
FROM webhook_deliveries 
WHERE status = 'dlq' 
ORDER BY created_at DESC;
```

## Ejemplo Completo

```bash
# 1. Ver qué hay en la DLQ (desde Supabase SQL Editor)
SELECT id, event_type, subscriber_url, error_message 
FROM webhook_deliveries 
WHERE status = 'dlq' 
LIMIT 5;

# 2. Reenviar los 5 más antiguos
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?limit=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncWJjc3ZzYWl3ZW1icGxha25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTU1MDEsImV4cCI6MjA4MTQ3MTUwMX0.VR43BAijAnRrN6yYEVFefGnoax6p0zfRT0u-NGl-uzU" \
  -H "Content-Type: application/json"

# 3. Verificar resultados
# Revisa los logs de la Edge Function para ver detalles
```

## Monitoreo

Después del replay, verifica el estado:

```sql
-- Ver deliveries que fueron reenviados exitosamente
SELECT 
  id,
  event_type,
  status,
  http_status_code,
  delivered_at
FROM webhook_deliveries 
WHERE status = 'success' 
  AND delivered_at > NOW() - INTERVAL '1 hour'
ORDER BY delivered_at DESC;
```

## Troubleshooting

### Todos los replays fallan con 401

1. **Verifica el secret `SUPABASE_ANON_KEY`** en la Edge Function
2. **Verifica que el anon key sea válido** (no expirado, no deshabilitado)
3. **Revisa los logs** de `webhook-dlq-replay` para ver detalles

### Algunos replays fallan, otros funcionan

- Puede ser que algunos webhooks sean para endpoints externos (no Supabase)
- Los webhooks a Supabase Edge Functions necesitan el anon key
- Los webhooks a endpoints externos no necesitan el anon key

### El replay funciona pero el webhook sigue fallando

- Verifica que el endpoint destino esté activo
- Revisa los logs del endpoint destino
- Verifica que la firma HMAC sea correcta (se preserva del original)

