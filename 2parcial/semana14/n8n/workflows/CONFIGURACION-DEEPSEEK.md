# Configuración con DeepSeek (Alternativa a Gemini)

## ✅ Workflows Actualizados

He actualizado los workflows para usar **DeepSeek** en lugar de Gemini. DeepSeek es una alternativa de IA más económica y con buen rendimiento.

## 🔑 Cómo Obtener API Key de DeepSeek

1. **Crear cuenta en DeepSeek**:
   - Visita: https://platform.deepseek.com/
   - Crea una cuenta o inicia sesión

2. **Obtener API Key**:
   - Ve a la sección de **API Keys** en tu panel de DeepSeek
   - Click en **"Create API Key"** o **"Generar Clave API"**
   - Copia la clave generada (guárdala de forma segura)

3. **Configurar en los Workflows**:
   - En el workflow 1 y 3, edita el nodo **"Set - Configuración"**
   - Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key real

## 📋 Workflows que Usan DeepSeek

### Workflow 1: Notificación Telegram
- **Nodo**: "HTTP Request - DeepSeek"
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Modelo**: `deepseek-chat`
- **Función**: Genera mensajes profesionales para notificaciones

### Workflow 3: Alertas
- **Nodo**: "DeepSeek - Análisis"
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Modelo**: `deepseek-chat`
- **Función**: Analiza eventos y determina nivel de urgencia

## 🔧 Estructura de la API de DeepSeek

Los workflows están configurados para usar el formato estándar de DeepSeek:

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "user",
      "content": "Tu prompt aquí"
    }
  ],
  "temperature": 0.7
}
```

**Respuesta esperada**:
```json
{
  "choices": [
    {
      "message": {
        "content": "Respuesta del modelo"
      }
    }
  ]
}
```

## 💰 Ventajas de DeepSeek

- ✅ **Más económico** que Gemini
- ✅ **Buena calidad** de respuestas
- ✅ **API compatible** con formato OpenAI
- ✅ **Rápido** en las respuestas
- ✅ **Soporte en español** excelente

## ⚙️ Configuración Detallada

### Workflow 1: Notificación Telegram

1. **Nodo "Set - Configuración"**:
   - `DEEPSEEK_API_KEY`: Tu API key de DeepSeek
   - `TELEGRAM_CHAT_ID`: Tu Chat ID de Telegram

2. **Nodo "HTTP Request - DeepSeek"**:
   - URL: `https://api.deepseek.com/v1/chat/completions`
   - Método: POST
   - Headers: `Authorization: Bearer {API_KEY}`
   - Body: Modelo `deepseek-chat` con el prompt

3. **Nodo "Telegram - Enviar Mensaje"**:
   - Extrae el contenido de `$json.body.choices[0].message.content`
   - Envía el mensaje al chat configurado

### Workflow 3: Alertas

1. **Nodo "Set - Configuración"**:
   - `DEEPSEEK_API_KEY`: Tu API key de DeepSeek

2. **Nodo "DeepSeek - Análisis"**:
   - Analiza el evento y determina urgencia
   - Responde con: CRITICA, ALTA, MEDIA o BAJA

3. **Nodo "Switch - Urgencia"**:
   - Evalúa la respuesta de DeepSeek
   - Enruta según el nivel de urgencia

## 🧪 Probar DeepSeek

Puedes probar la API de DeepSeek directamente con curl:

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hola, ¿cómo estás?"}],
    "temperature": 0.7
  }'
```

## 📝 Notas Importantes

- **Modelo usado**: `deepseek-chat` (modelo de chat general)
- **Temperature**: 0.7 para notificaciones, 0.3 para análisis (más determinista)
- **Formato de respuesta**: Compatible con OpenAI Chat Completions
- **Límites**: Revisa los límites de tu plan en DeepSeek

## 🔄 Si Quieres Cambiar de Vuelta a Gemini

Si en el futuro quieres volver a usar Gemini, solo necesitas:
1. Cambiar la URL a la API de Gemini
2. Ajustar el formato del body
3. Actualizar cómo se extrae la respuesta

Pero con DeepSeek deberías tener todo lo que necesitas. 🚀
