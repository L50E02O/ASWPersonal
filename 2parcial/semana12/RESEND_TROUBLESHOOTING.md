# Solución de Problemas con Resend

## Error: "The gmail.com domain is not verified"

### ❌ Problema

```
Notification failed The gmail.com domain is not verified. 
Please, add and verify your domain on https://resend.com/domains
```

### 🔍 Causa

Estás intentando usar una dirección de Gmail (ej: `tuemail@gmail.com`) en el campo `EMAIL_FROM`, pero Resend **NO permite** usar dominios que no hayas verificado. Como no puedes verificar `gmail.com` (es propiedad de Google), Resend rechaza el envío.

### ✅ Solución Rápida (Para Pruebas)

**Usa el dominio de prueba de Resend:**

1. Ve a: Supabase Dashboard → Edge Functions → `webhook-external-notifier` → Secrets
2. Actualiza `EMAIL_FROM`:
   ```
   EMAIL_FROM=onboarding@resend.dev
   ```
3. `EMAIL_TO` puede seguir siendo tu email de Gmail:
   ```
   EMAIL_TO=tu-email@gmail.com
   ```

**Resultado**: Los emails se enviarán desde `onboarding@resend.dev` a tu email de Gmail.

### ✅ Solución para Producción

Si necesitas usar tu propio dominio en producción:

1. **Verifica tu dominio en Resend**:
   - Ve a: https://resend.com/domains
   - Haz clic en "Add Domain"
   - Ingresa tu dominio (ej: `tudominio.com`)
   - Agrega los registros DNS que Resend te proporciona
   - Espera a que se verifique (puede tardar hasta 24 horas)

2. **Usa tu dominio verificado**:
   ```
   EMAIL_FROM=noreply@tudominio.com
   EMAIL_TO=destinatario@example.com
   ```

### 📋 Resumen de Configuración

| Escenario | EMAIL_FROM | EMAIL_TO | Estado |
|-----------|------------|----------|--------|
| **Pruebas** | `onboarding@resend.dev` | `tu-email@gmail.com` | ✅ Funciona |
| **Pruebas** | `tuemail@gmail.com` | `tu-email@gmail.com` | ❌ Error |
| **Producción** | `noreply@tudominio.com` | `destinatario@example.com` | ✅ Funciona (si dominio verificado) |
| **Producción** | `noreply@tudominio.com` | `destinatario@example.com` | ❌ Error (si dominio NO verificado) |

### 🔧 Verificar Configuración Actual

Para ver qué tienes configurado actualmente:

1. Ve a: Supabase Dashboard → Edge Functions → `webhook-external-notifier` → Secrets
2. Revisa el valor de `EMAIL_FROM`
3. Si es algo como `...@gmail.com`, cámbialo a `onboarding@resend.dev`

### 📧 Verificar que Funciona

Después de cambiar `EMAIL_FROM` a `onboarding@resend.dev`:

1. Reinicia la Edge Function (o espera unos segundos)
2. Crea un arquitecto para disparar el webhook
3. Revisa los logs de la Edge Function:
   ```
   [INFO] Email enviado exitosamente vía Resend
   ```
4. Revisa tu bandeja de entrada (y spam) en el email configurado en `EMAIL_TO`

### ⚠️ Notas Importantes

- **EMAIL_FROM**: Debe ser un dominio verificado en Resend o `onboarding@resend.dev`
- **EMAIL_TO**: Puede ser cualquier email válido (Gmail, Outlook, etc.)
- **Límite del dominio de prueba**: `onboarding@resend.dev` tiene límites, pero es suficiente para desarrollo
- **Spam**: Los emails desde `onboarding@resend.dev` pueden ir a spam inicialmente

### 🚀 Próximos Pasos

1. ✅ Cambia `EMAIL_FROM` a `onboarding@resend.dev`
2. ✅ Prueba creando un arquitecto
3. ✅ Verifica que recibes el email
4. 📝 Para producción, verifica tu propio dominio en Resend

