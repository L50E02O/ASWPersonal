# Propósito de cada Edge Function (Webhook)

## Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE WEBHOOKS                        │
└─────────────────────────────────────────────────────────────┘

1. POST /arquitectos (API Gateway)
   ↓
2. Microservicio A crea arquitecto
   ↓
3. Publica webhook: architect.registered
   ├─→ Edge Function 1: webhook-event-logger
   │   └─→ Guarda en BD (auditoría)
   │
   └─→ RabbitMQ: arquitecto.creado
       ↓
4. Microservicio B crea verificación pendiente
   ↓
5. Publica webhook: verification.pending
   └─→ Edge Function 2: webhook-external-notifier
       └─→ Envía email de notificación

6. Si un webhook falla 6 veces → va a DLQ
   └─→ Edge Function 3: webhook-dlq-replay
       └─→ Reenvía webhooks desde DLQ (herramienta de recuperación)
```

---

## 🔵 Edge Function 1: `webhook-event-logger`

### 📍 URL
```
https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-event-logger
```

### 🎯 Propósito Principal
**Registro y Auditoría de Eventos**

Esta función actúa como un **sistema de logging centralizado** que guarda todos los eventos importantes del sistema en la base de datos para auditoría, análisis y cumplimiento.

### 📥 Qué Recibe
- **Evento**: `architect.registered`
- **Cuándo se dispara**: Cuando se crea un nuevo arquitecto en el sistema
- **Origen**: Microservicio Arquitecto

### ⚙️ Qué Hace

1. **Valida la seguridad**:
   - ✅ Verifica firma HMAC (asegura que el webhook es legítimo)
   - ✅ Verifica timestamp (anti-replay attack, máximo 5 minutos)

2. **Previene duplicados**:
   - ✅ Verifica idempotencia (evita procesar el mismo evento dos veces)

3. **Guarda en base de datos**:
   - ✅ Inserta el evento completo en la tabla `webhook_events`
   - ✅ Guarda: payload completo, firma, timestamp, correlation_id

4. **Retorna confirmación**:
   - ✅ Retorna 200 OK con el `event_id` generado

### 💾 Dónde se Guarda
**Tabla**: `webhook_events` en Supabase

**Campos importantes**:
- `event_id`: ID único del evento
- `event_type`: `architect.registered`
- `idempotency_key`: Clave para evitar duplicados
- `payload`: Datos completos del evento (JSONB)
- `timestamp`: Cuándo ocurrió el evento
- `correlation_id`: Para rastrear el evento en todo el sistema

### 🎯 Casos de Uso

- **Auditoría**: Saber qué arquitectos se registraron y cuándo
- **Análisis**: Generar reportes de registros por fecha
- **Cumplimiento**: Mantener un registro histórico completo
- **Debugging**: Rastrear problemas usando correlation_id
- **Análisis de negocio**: Ver tendencias de registros

### 📊 Ejemplo de Consulta

```sql
-- Ver todos los arquitectos registrados
SELECT 
  event_id,
  event_type,
  payload->>'data'->>'architect_id' as architect_id,
  payload->>'data'->>'cedula' as cedula,
  timestamp,
  correlation_id
FROM webhook_events 
WHERE event_type = 'architect.registered'
ORDER BY timestamp DESC;
```

---

## 🟢 Edge Function 2: `webhook-external-notifier`

### 📍 URL
```
https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-external-notifier
```

### 🎯 Propósito Principal
**Notificaciones Externas por Email**

Esta función envía notificaciones por correo electrónico cuando ocurren eventos importantes que requieren atención externa (equipos, administradores, usuarios).

### 📥 Qué Recibe
- **Evento**: `verification.pending`
- **Cuándo se dispara**: Cuando se crea una verificación pendiente
- **Origen**: Microservicio Verificación

### ⚙️ Qué Hace

1. **Valida la seguridad**:
   - ✅ Verifica firma HMAC
   - ✅ Verifica idempotencia (evita enviar el mismo email dos veces)

2. **Envía notificación por email**:
   - ✅ Formatea el contenido en HTML profesional
   - ✅ Envía email usando Resend o SendGrid
   - ✅ Incluye todos los detalles del evento

3. **Registra el resultado**:
   - ✅ Guarda en `processed_webhooks` para idempotencia
   - ✅ Si falla, retorna 500 para que el sistema reintente

4. **Retorna confirmación**:
   - ✅ Retorna 200 OK si el email se envió exitosamente
   - ✅ Retorna 500 si falla (para retry automático)

### 📧 Qué Contiene el Email

El email incluye:
- **Asunto**: `🔔 Webhook: verification.pending`
- **Contenido HTML** con:
  - Información del evento
  - ID de verificación
  - ID de arquitecto
  - Estado de la verificación
  - Timestamp
  - Correlation ID

### 🎯 Casos de Uso

- **Notificaciones a moderadores**: Alertar cuando hay una nueva verificación pendiente
- **Notificaciones a administradores**: Mantener informado al equipo
- **Integración con sistemas externos**: Enviar eventos a otros sistemas vía email
- **Alertas operacionales**: Notificar sobre eventos críticos

### 📊 Ejemplo de Email Enviado

```
Asunto: 🔔 Webhook: verification.pending

📋 Verificación Pendiente
ID de Verificación: e9db415f-3dd3-40d6-816b-0a37687acfce
ID de Arquitecto: 3446acc5-81bb-4f1e-af68-169e77e67f5b
Estado: pendiente
ID de Moderador: 789e0123-e45b-67c8-d901-234567890123
Fecha de Verificación: 16/12/2025, 4:30:56 p.m.
```

---

## 🟡 Edge Function 3: `webhook-dlq-replay`

### 📍 URL
```
https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay
```

### 🎯 Propósito Principal
**Herramienta de Recuperación de Webhooks Fallidos**

Esta función NO recibe webhooks automáticamente. Es una **herramienta manual/administrativa** para recuperar webhooks que fallaron después de todos los intentos de retry y están en la Dead Letter Queue (DLQ).

### 📥 Qué NO Recibe Automáticamente
- ❌ No recibe webhooks automáticamente
- ✅ Se llama manualmente cuando necesitas recuperar webhooks fallidos

### ⚙️ Qué Hace

1. **Consulta la DLQ**:
   - ✅ Busca webhooks con `status = 'dlq'` en la tabla `webhook_deliveries`
   - ✅ Puede buscar uno específico o un batch

2. **Reenvía los webhooks**:
   - ✅ Toma el payload original del webhook
   - ✅ Reenvía HTTP POST al suscriptor original
   - ✅ Agrega header `X-Replay: true` para indicar que es un replay
   - ✅ Agrega autorización si es necesario

3. **Actualiza el estado**:
   - ✅ Si el reenvío es exitoso → `status = 'success'`
   - ✅ Si falla nuevamente → `status = 'dlq'` (permanece en DLQ)

### 🎯 Casos de Uso

- **Recuperación después de mantenimiento**: Edge Function estaba caída, ahora está activa
- **Corrección de problemas**: Se resolvió el problema que causaba el fallo
- **Reintento manual**: Quieres reenviar webhooks específicos
- **Operaciones administrativas**: Limpiar la DLQ periódicamente

### 📊 Ejemplo de Uso

```bash
# Reenviar los 10 webhooks más antiguos de la DLQ
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?limit=10" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Reenviar un webhook específico
curl -X POST "https://hgqbcsvsaiwembplaknq.supabase.co/functions/v1/webhook-dlq-replay?delivery_id=UUID" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 💾 Dónde Busca
**Tabla**: `webhook_deliveries` en Supabase
**Filtro**: `WHERE status = 'dlq'`

---

## 📋 Resumen Comparativo

| Edge Function | Recibe Automáticamente | Propósito | Guarda en BD | Envía Email |
|---------------|------------------------|-----------|--------------|-------------|
| **webhook-event-logger** | ✅ `architect.registered` | Auditoría y logging | ✅ `webhook_events` | ❌ |
| **webhook-external-notifier** | ✅ `verification.pending` | Notificaciones externas | ✅ `processed_webhooks` | ✅ |
| **webhook-dlq-replay** | ❌ (se llama manualmente) | Recuperación de fallos | ✅ Actualiza `webhook_deliveries` | ❌ |

---

## 🔄 Flujo Completo con las 3 Funciones

```
1. Cliente crea arquitecto
   POST /arquitectos
   ↓
2. Microservicio A crea arquitecto
   ↓
3. Publica webhook: architect.registered
   └─→ Edge Function 1 (Logger)
       └─→ Guarda en webhook_events ✅
   ↓
4. Publica evento RabbitMQ: arquitecto.creado
   ↓
5. Microservicio B crea verificación pendiente
   ↓
6. Publica webhook: verification.pending
   └─→ Edge Function 2 (Notifier)
       └─→ Envía email ✅
   ↓
7. Si Edge Function 2 falla 6 veces
   └─→ Webhook va a DLQ (status='dlq' en webhook_deliveries)
   ↓
8. Administrador llama Edge Function 3 (Replay)
   └─→ Reenvía webhooks desde DLQ ✅
```

---

## 🎯 ¿Por qué 3 funciones separadas?

### Separación de Responsabilidades

1. **Logger**: Solo guarda, no notifica (rápido, confiable)
2. **Notifier**: Solo notifica, puede fallar (no bloquea el flujo principal)
3. **Replay**: Herramienta administrativa (se usa cuando se necesita)

### Ventajas

- ✅ **Resiliencia**: Si el email falla, el logging sigue funcionando
- ✅ **Escalabilidad**: Cada función puede escalar independientemente
- ✅ **Mantenimiento**: Puedes actualizar una sin afectar las otras
- ✅ **Costo**: Solo pagas por lo que usas (serverless)

---

## 📝 Notas Importantes

- **Edge Function 1 y 2** se ejecutan automáticamente cuando ocurren los eventos
- **Edge Function 3** se ejecuta manualmente cuando necesitas recuperar webhooks
- Todas las funciones validan seguridad (HMAC, timestamp, idempotencia)
- Todas tienen logs detallados para diagnóstico

