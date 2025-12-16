# Ejemplos de Payloads de Webhooks

## Payload Estándar para `verification.pending`

Este es el formato estándar del payload que se envía cuando se crea una verificación pendiente.

### Estructura Completa

```json
{
  "event": "verification.pending",
  "version": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "idempotency_key": "dmVyaWZpY2F0aW9uLnBlbmRpbmc6NTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwMDoyMDI1LTEyLTE2VDEwOjMwOjAwLjAwMFo=",
  "timestamp": "2025-12-16T10:30:00.000Z",
  "metadata": {
    "correlation_id": "verif-550e8400-e29b-41d4-a716-446655440000-1737025800000",
    "source": "microservicio-verificacion"
  },
  "data": {
    "verification_id": "550e8400-e29b-41d4-a716-446655440000",
    "architect_id": "123e4567-e89b-12d3-a456-426614174000",
    "estado": "pendiente",
    "moderador_id": "789e0123-e45b-67c8-d901-234567890123",
    "fecha_verificacion": "2025-12-16T10:30:00.000Z",
    "created_at": "2025-12-16T10:30:00.000Z"
  }
}
```

### Campos del Payload

#### Campos Principales

- **`event`**: Tipo de evento (`verification.pending`)
- **`version`**: Versión del formato del webhook (`1.0`)
- **`id`**: UUID único del evento
- **`idempotency_key`**: Clave de idempotencia (Base64 del formato `event:entity_id:timestamp`)
- **`timestamp`**: Timestamp ISO 8601 del evento

#### Metadata

- **`correlation_id`**: ID de correlación para rastrear el evento a través del sistema
- **`source`**: Nombre del microservicio que generó el evento

#### Data (Datos Específicos del Evento)

- **`verification_id`**: UUID de la verificación
- **`architect_id`**: UUID del arquitecto asociado
- **`estado`**: Estado de la verificación (`pendiente`, `verificado`, `rechazado`)
- **`moderador_id`**: UUID del moderador asignado
- **`fecha_verificacion`**: Fecha de la verificación (ISO 8601)
- **`created_at`**: Fecha de creación (ISO 8601)

## Payload Estándar para `architect.registered`

```json
{
  "event": "architect.registered",
  "version": "1.0",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "idempotency_key": "YXJjaGl0ZWN0LnJlZ2lzdGVyZWQ6MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwOjIwMjUtMTItMTZUMTA6MzA6MDAuMDAwWg==",
  "timestamp": "2025-12-16T10:30:00.000Z",
  "metadata": {
    "correlation_id": "arch-123e4567-e89b-12d3-a456-426614174000-1737025800000",
    "source": "microservicio-arquitecto"
  },
  "data": {
    "architect_id": "123e4567-e89b-12d3-a456-426614174000",
    "cedula": "1234567890",
    "usuario_id": "789e0123-e45b-67c8-d901-234567890123",
    "verificado": false,
    "created_at": "2025-12-16T10:30:00.000Z"
  }
}
```

## Headers HTTP Enviados

Cada webhook incluye los siguientes headers HTTP:

- **`X-Webhook-Signature`**: Firma HMAC-SHA256 del payload
- **`X-Webhook-Event`**: Tipo de evento
- **`X-Webhook-Id`**: ID único del evento
- **`X-Webhook-Timestamp`**: Timestamp del evento
- **`X-Correlation-Id`**: ID de correlación
- **`Content-Type`**: `application/json`

## Ejemplo de Validación de Firma HMAC

```typescript
import { createHmac } from 'crypto';

function validateHMACSignature(payload: any, signature: string, secret: string): boolean {
  const payloadString = JSON.stringify(payload);
  const hmac = createHmac('sha256', secret);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}
```

