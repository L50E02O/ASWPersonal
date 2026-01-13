# Guía de Importación de Workflows en n8n

Este directorio contiene los 3 workflows requeridos para el Taller 4. Sigue estos pasos para importarlos en n8n.

## Archivos Disponibles

1. **1-notificacion-telegram.json** - Workflow de notificaciones vía Telegram
2. **2-sincronizacion-google-sheets.json** - Workflow de sincronización con Google Sheets
3. **3-alertas-gemini-switch.json** - Workflow de alertas con análisis de urgencia

## Pasos para Importar

### 1. Acceder a n8n
- Abre `http://localhost:5678` en tu navegador
- Inicia sesión con: `admin` / `uleam2025`

### 2. Importar cada Workflow

Para cada archivo JSON:

1. En la interfaz de n8n, haz clic en el menú **"Workflows"** (arriba a la izquierda)
2. Haz clic en el botón **"Import from File"** o **"Import"**
3. Selecciona el archivo JSON correspondiente
4. Haz clic en **"Import"**

### 3. Configurar Credenciales

Después de importar, necesitarás configurar las credenciales para cada workflow:

#### Workflow 1: Notificación Telegram
1. Haz clic en el nodo **"Telegram - Enviar Mensaje"**
2. En "Credential to connect with", haz clic en **"Create New Credential"**
3. Selecciona **"Telegram"**
4. Ingresa tu **Bot Token** de Telegram (obtén uno desde @BotFather)
5. Guarda la credencial
6. Configura la variable de entorno `TELEGRAM_CHAT_ID` en n8n (Settings > Environment Variables)

#### Workflow 2: Sincronización Google Sheets
1. Haz clic en el nodo **"Google Sheets - Append"**
2. En "Credential to connect with", haz clic en **"Create New Credential"**
3. Selecciona **"Google Sheets OAuth2 API"**
4. Sigue el proceso de autenticación OAuth2 con Google
5. Configura la variable de entorno `GOOGLE_SHEETS_DOCUMENT_ID` con el ID de tu hoja de cálculo

#### Workflow 3: Alertas Gemini Switch
- Este workflow usa la misma API de Gemini que el Workflow 1
- Asegúrate de tener configurada la variable `GEMINI_API_KEY` en n8n

### 4. Configurar Variables de Entorno en n8n

1. Ve a **Settings** (icono de engranaje) > **Environment Variables**
2. Agrega las siguientes variables:

```
GEMINI_API_KEY=tu-api-key-de-gemini
TELEGRAM_CHAT_ID=tu-chat-id-de-telegram
GOOGLE_SHEETS_DOCUMENT_ID=id-de-tu-google-sheet
```

### 5. Obtener URLs de Webhooks

Para cada workflow importado:

1. Haz clic en el workflow para abrirlo
2. Haz clic en el nodo **Webhook**
3. Haz clic en **"Listen for Test Event"** o **"Test"**
4. Copia la URL que aparece (ej: `http://localhost:5678/webhook-test/abc123`)
5. Guarda esta URL para configurar en el backend

### 6. Activar los Workflows

1. En la lista de workflows, activa el toggle en cada workflow (esquina superior derecha)
2. Los workflows deben estar **activos** (toggle verde) para recibir webhooks

### 7. Configurar el Backend

Actualiza el archivo `.env` del api-gateway con la URL del webhook principal:

```env
# Usa la URL del workflow que quieras usar como principal
# Por ejemplo, si quieres usar el de notificaciones:
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/notificacion-webhook-id

# O si quieres usar el de alertas:
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/alertas-webhook-id
```

**Nota**: Puedes configurar múltiples webhooks creando diferentes instancias del `WebhookEmitterService` o modificando el servicio para enviar a múltiples URLs.

## Estructura de los Workflows

### Workflow 1: Notificación Telegram
- **Webhook** → Recibe eventos del backend
- **HTTP Request (Gemini)** → Genera mensaje profesional usando IA
- **Telegram** → Envía notificación al chat configurado
- **Respond to Webhook** → Responde al backend

### Workflow 2: Sincronización Google Sheets
- **Webhook** → Recibe eventos del backend
- **Google Sheets (Append)** → Agrega registro a la hoja de cálculo
- **Respond to Webhook** → Responde al backend

### Workflow 3: Alertas Gemini Switch
- **Webhook** → Recibe eventos del backend
- **Gemini (Análisis)** → Analiza el evento y determina urgencia
- **Switch (Urgencia)** → Enruta según nivel (CRITICA, ALTA, MEDIA, BAJA)
- **Set** → Configura mensaje según urgencia
- **Respond to Webhook** → Responde al backend

## Eventos que Activan los Workflows

Los workflows recibirán eventos con este formato:

```json
{
  "evento": "arquitecto.creado",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": {
    "arquitecto": { /* datos del arquitecto */ },
    "datosCreacion": { /* DTO original */ }
  }
}
```

Eventos disponibles:
- `arquitecto.creado`
- `arquitecto.actualizado`
- `verificacion.creada`
- `verificacion.actualizada`

## Solución de Problemas

### El workflow no recibe webhooks
- Verifica que el workflow esté **activo** (toggle verde)
- Verifica que la URL del webhook sea correcta
- Revisa los logs del workflow en n8n (icono de historial)

### Error de credenciales
- Asegúrate de haber configurado todas las credenciales necesarias
- Verifica que las variables de entorno estén configuradas

### Error en la conexión con Gemini
- Verifica que `GEMINI_API_KEY` esté configurada correctamente
- Revisa que la URL de la API de Gemini sea correcta

### Error en Telegram
- Verifica que el Bot Token sea válido
- Asegúrate de que `TELEGRAM_CHAT_ID` esté configurado
- Verifica que el bot tenga permisos para enviar mensajes

## Pruebas

Para probar los workflows:

1. Crea o actualiza un arquitecto/verificación desde el API Gateway
2. Verifica que el webhook se haya recibido en n8n
3. Revisa los logs de ejecución en n8n
4. Verifica que las acciones se hayan ejecutado (Telegram, Google Sheets, etc.)
