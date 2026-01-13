# ¿Por qué no puedo editar la URL del Webhook en n8n?

## 🔍 Explicación

La URL del webhook que ves en n8n (`http://0.0.0.0:5678/webhook-test/sincronizacion`) **NO se puede editar directamente** porque:

1. **Se genera automáticamente** basándose en:
   - El **Path** que configuraste en el nodo (ej: "sincronizacion")
   - Si estás en modo **Test** o **Production**
   - La configuración de n8n (host, puerto)

2. **`0.0.0.0` es normal** - Es la dirección interna que n8n usa dentro del contenedor Docker

## ✅ Solución: Usar `localhost` en el Backend

**NO necesitas editar la URL en n8n**. Lo que debes hacer es:

### En el Backend (.env del api-gateway):

Usa `localhost` en lugar de `0.0.0.0`:

```env
# ✅ CORRECTO - Usa localhost
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/sincronizacion

# ❌ INCORRECTO - No uses 0.0.0.0
N8N_WEBHOOK_URL=http://0.0.0.0:5678/webhook-test/sincronizacion
```

### Por qué funciona así:

- **Dentro del contenedor Docker**: n8n usa `0.0.0.0` (escucha en todas las interfaces)
- **Desde tu máquina local**: Debes usar `localhost` para acceder al contenedor
- **Desde el backend**: También usa `localhost` para comunicarse con n8n

## 📝 Diferencia entre Test URL y Production URL

En n8n verás dos opciones:

### Test URL (para desarrollo):
```
http://0.0.0.0:5678/webhook-test/sincronizacion
```
- Se genera automáticamente
- Solo funciona cuando el workflow está **activo** y en modo test
- Úsala para desarrollo y pruebas

### Production URL (para producción):
```
http://0.0.0.0:5678/webhook/sincronizacion
```
- Se genera automáticamente
- Para uso en producción
- Más estable y permanente

**Para desarrollo, usa la Test URL** (la que termina en `/webhook-test/...`)

## 🎯 Pasos Correctos

### 1. En n8n (NO edites la URL mostrada):
- Solo verifica que el **Path** sea correcto (ej: "sincronizacion")
- Activa el workflow (toggle verde)
- Copia la URL que muestra (puede decir `0.0.0.0`)

### 2. En el Backend (.env):
- **Cambia `0.0.0.0` por `localhost`**:
  ```env
  N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/sincronizacion
  ```

### 3. Reinicia el API Gateway:
```bash
cd 2parcial\semana14\api-gateway
npm run start:dev
```

## 🔧 Si Quieres Cambiar el Path

Si quieres cambiar la ruta del webhook (ej: de "sincronizacion" a otra cosa):

1. En n8n, en el nodo Webhook:
   - Edita el campo **"Path"**
   - Ejemplo: cambia "sincronizacion" a "sync-data"
   - Guarda el workflow
   - La URL se actualizará automáticamente a: `http://0.0.0.0:5678/webhook-test/sync-data`

2. Actualiza el `.env` del backend:
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/sync-data
   ```

## 📋 Resumen

- ✅ **Es normal** que n8n muestre `0.0.0.0` - no lo edites en n8n
- ✅ **No puedes editar** la URL completa directamente en n8n
- ✅ **Puedes cambiar** el Path en el nodo Webhook
- ✅ **En el backend**, siempre usa `localhost` en lugar de `0.0.0.0`
- ✅ **Funciona porque** Docker mapea el puerto, permitiendo acceso vía `localhost`

## 🧪 Verificar que Funciona

1. Activa el workflow en n8n
2. Configura el `.env` con `localhost`
3. Reinicia el backend
4. Prueba creando un arquitecto/verificación
5. Verifica en n8n → Executions que se recibió el webhook

¡La URL con `0.0.0.0` en n8n es normal, solo usa `localhost` en tu backend! 🚀
