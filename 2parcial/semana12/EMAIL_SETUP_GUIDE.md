# Guía de Configuración de Email para Webhooks

## Resumen

La Edge Function `webhook-external-notifier` envía notificaciones por correo electrónico cuando se reciben webhooks. Soporta dos servicios:

1. **Resend** (Recomendado) - Más simple y moderno
2. **SendGrid** (Alternativa) - Más establecido en la industria

## Opción 1: Resend (Recomendado)

### Ventajas
- ✅ Tier gratuito generoso (3,000 emails/mes)
- ✅ API simple y moderna
- ✅ Verificación de dominio fácil
- ✅ Dashboard intuitivo

### Pasos de Configuración

1. **Crear cuenta en Resend**
   - Visita: https://resend.com
   - Crea una cuenta gratuita
   - Verifica tu email

2. **Obtener API Key**
   - Ve a: https://resend.com/api-keys
   - Haz clic en "Create API Key"
   - Dale un nombre (ej: "Webhook Notifier")
   - Copia la API key (solo se muestra una vez)

3. **Verificar Dominio (Opcional para producción)**
   - Ve a: https://resend.com/domains
   - Agrega tu dominio
   - Configura los registros DNS según las instrucciones
   - Para pruebas, puedes usar `onboarding@resend.dev`

4. **Configurar en Supabase**
   - Ve a: Supabase Dashboard → Edge Functions → `webhook-external-notifier` → Secrets
   - Agrega los siguientes secrets:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     EMAIL_FROM=noreply@tudominio.com  (o onboarding@resend.dev para pruebas)
     EMAIL_TO=tu-email@example.com
     ```

### Ejemplo de Configuración

```env
RESEND_API_KEY=re_AbCdEfGhIjKlMnOpQrStUvWxYz123456789
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=admin@example.com,notifications@example.com
```

## Opción 2: SendGrid

### Ventajas
- ✅ Tier gratuito (100 emails/día)
- ✅ Muy establecido en la industria
- ✅ Excelente documentación
- ✅ Funciones avanzadas disponibles

### Pasos de Configuración

1. **Crear cuenta en SendGrid**
   - Visita: https://sendgrid.com
   - Crea una cuenta gratuita
   - Verifica tu email

2. **Verificar Sender Identity**
   - Ve a: Settings → Sender Authentication
   - Verifica un dominio o usa "Single Sender Verification" para pruebas
   - Para pruebas, puedes usar el email verificado de tu cuenta

3. **Crear API Key**
   - Ve a: Settings → API Keys
   - Haz clic en "Create API Key"
   - Dale un nombre (ej: "Webhook Notifier")
   - Selecciona permisos: "Full Access" o "Mail Send" (más seguro)
   - Copia la API key (solo se muestra una vez)

4. **Configurar en Supabase**
   - Ve a: Supabase Dashboard → Edge Functions → `webhook-external-notifier` → Secrets
   - Agrega los siguientes secrets:
     ```
     SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
     EMAIL_FROM=verified-email@tudominio.com
     EMAIL_TO=tu-email@example.com
     ```

### Ejemplo de Configuración

```env
SENDGRID_API_KEY=SG.AbCdEfGhIjKlMnOpQrStUvWxYz123456789
EMAIL_FROM=noreply@tudominio.com
EMAIL_TO=admin@example.com
```

## Configuración de EMAIL_TO

El campo `EMAIL_TO` puede contener:
- **Un solo email**: `admin@example.com`
- **Múltiples emails** (separados por comas): `admin@example.com,notifications@example.com,team@example.com`

## Probar la Configuración

Una vez configurado, puedes probar creando un arquitecto:

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
1. Crear el arquitecto
2. Disparar el webhook `verification.pending`
3. Enviar un correo electrónico a la dirección configurada en `EMAIL_TO`

## Formato del Email

El email enviado incluye:
- **Asunto**: `🔔 Webhook: verification.pending` (o el tipo de evento)
- **Contenido HTML**: Formato profesional con:
  - Información del evento
  - Timestamp
  - Correlation ID
  - Datos específicos del evento formateados

## Troubleshooting

### No recibo emails

1. **Verifica los logs de la Edge Function**:
   - Supabase Dashboard → Edge Functions → `webhook-external-notifier` → Logs
   - Busca errores relacionados con el servicio de email

2. **Verifica que los secrets estén configurados**:
   - Asegúrate de que `RESEND_API_KEY` o `SENDGRID_API_KEY` esté configurado
   - Verifica que `EMAIL_FROM` y `EMAIL_TO` estén configurados

3. **Verifica el dominio/email remitente**:
   - En Resend: El dominio debe estar verificado o usar `onboarding@resend.dev`
   - En SendGrid: El email debe estar verificado en "Sender Authentication"

4. **Revisa la carpeta de spam**:
   - Los emails pueden llegar a spam si el dominio no está verificado

### Error: "Invalid API Key"

- Verifica que copiaste la API key completa
- En SendGrid, asegúrate de que el API key tenga permisos de "Mail Send"

### Error: "Domain not verified"

- Verifica tu dominio en el dashboard del servicio de email
- Para pruebas, usa los emails de prueba proporcionados por cada servicio

## Comparación de Servicios

| Característica | Resend | SendGrid |
|---------------|--------|----------|
| Tier Gratuito | 3,000 emails/mes | 100 emails/día |
| Verificación | Más simple | Más estricta |
| API | Moderna y simple | Establecida |
| Dashboard | Intuitivo | Completo |
| Documentación | Buena | Excelente |

## Recomendación

Para desarrollo y pruebas: **Resend** (más fácil de configurar)
Para producción: **Resend** o **SendGrid** (ambos son confiables)

