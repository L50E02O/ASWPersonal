# Configuración Gratuita de Workflows (Sin Plan Enterprise)

## ✅ Solución Implementada

He actualizado todos los workflows para que **NO requieran el plan Enterprise**. En lugar de usar variables de entorno (que requieren pago), ahora cada workflow tiene un nodo **"Set - Configuración"** al inicio donde puedes configurar los valores directamente.

## 📝 Cómo Configurar (Paso a Paso)

### Workflow 1: Notificación Telegram

1. **Importa el workflow** `1-notificacion-telegram.json`
2. **Abre el workflow** haciendo click en él
3. **Click en el nodo "Set - Configuración"** (el segundo nodo después del Webhook)
4. **Edita los valores**:
   - `DEEPSEEK_API_KEY`: Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key de DeepSeek
   - `TELEGRAM_CHAT_ID`: Reemplaza `TU_CHAT_ID_DE_TELEGRAM_AQUI` con tu Chat ID
5. **Guarda el workflow**

### Workflow 2: Sincronización Google Sheets

1. **Importa el workflow** `2-sincronizacion-google-sheets.json`
2. **Abre el workflow**
3. **Click en el nodo "Set - Configuración"**
4. **Edita el valor**:
   - `GOOGLE_SHEETS_DOCUMENT_ID`: Reemplaza `TU_GOOGLE_SHEETS_DOCUMENT_ID_AQUI` con el ID de tu Google Sheet
   - **Cómo obtener el ID**: Está en la URL de tu Google Sheet
     - Ejemplo: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`
     - El ID es: `1a2b3c4d5e6f7g8h9i0j`
5. **Guarda el workflow**

### Workflow 3: Alertas Gemini Switch

1. **Importa el workflow** `3-alertas-gemini-switch.json`
2. **Abre el workflow**
3. **Click en el nodo "Set - Configuración"**
4. **Edita el valor**:
   - `DEEPSEEK_API_KEY`: Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key de DeepSeek
5. **Guarda el workflow**

## 🔑 Cómo Obtener las Credenciales

### DeepSeek API Key
1. Ve a [DeepSeek Platform](https://platform.deepseek.com/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección de **API Keys**
4. Click en "Create API Key" o "Generar Clave API"
5. Copia la API key generada

**Nota**: DeepSeek es más económico que Gemini y tiene excelente soporte en español.

### Telegram Chat ID y Bot Token
1. **Crear Bot**:
   - Abre Telegram y busca `@BotFather`
   - Envía `/newbot` y sigue las instrucciones
   - Copia el **Bot Token** que te proporciona

2. **Obtener Chat ID**:
   - Envía un mensaje a tu bot
   - Visita: `https://api.telegram.org/bot<TU_BOT_TOKEN>/getUpdates`
   - Busca el campo `"chat":{"id":123456789}` - ese número es tu Chat ID

### Google Sheets Document ID
1. Abre tu Google Sheet
2. Mira la URL en el navegador
3. El ID está entre `/d/` y `/edit`
   - Ejemplo: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
   - El ID es: `ABC123XYZ`

## ⚙️ Configurar Credenciales en n8n

Además de los valores en el nodo "Set", necesitas configurar credenciales:

### Telegram Credencial
1. En el workflow 1, click en el nodo **"Telegram - Enviar Mensaje"**
2. En "Credential to connect with", click en **"Create New Credential"**
3. Selecciona **"Telegram"**
4. Pega tu **Bot Token** (obtenido de @BotFather)
5. Guarda

### Google Sheets Credencial
1. En el workflow 2, click en el nodo **"Google Sheets - Append"**
2. En "Credential to connect with", click en **"Create New Credential"**
3. Selecciona **"Google Sheets OAuth2 API"**
4. Sigue el proceso de autenticación OAuth2 con Google
5. Acepta los permisos necesarios
6. Guarda

## ✅ Ventajas de Esta Solución

- ✅ **100% Gratuito** - No requiere plan Enterprise
- ✅ **Fácil de Configurar** - Solo editas un nodo en cada workflow
- ✅ **Seguro** - Las credenciales se almacenan en n8n (no en código)
- ✅ **Portable** - Cada workflow tiene su propia configuración

## 🔒 Nota de Seguridad

Aunque los valores están en el workflow, n8n almacena las credenciales de forma segura. Sin embargo, si compartes los workflows, asegúrate de no incluir valores reales en los JSON exportados.

## 🧪 Probar los Workflows

Después de configurar:

1. **Activa cada workflow** (toggle en la esquina superior derecha)
2. **Obtén la URL del webhook** de cada uno
3. **Actualiza** `N8N_WEBHOOK_URL` en el `.env` del api-gateway
4. **Prueba** creando un arquitecto o verificación desde el API

¡Listo! Todo funciona sin necesidad del plan Enterprise. 🎉
