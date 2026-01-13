# Solución: Access Blocked - Authorization Error (Error 400)

## 🔴 Problema

Estás viendo el error:
```
Access blocked: Authorization Error
Error 400: invalid_request
```

**Causa**: El OAuth Redirect URL en n8n está usando `0.0.0.0` en lugar de `localhost`.

## ✅ Solución Paso a Paso

### 1. Corregir en n8n

1. **En n8n, en el nodo Google Sheets**:
   - Click en el nodo **"Google Sheets - Append"**
   - En el campo **"OAuth Redirect URL"**
   - **Cambia** `http://0.0.0.0:5678/rest/oauth2-credential/callback`
   - **Por**: `http://localhost:5678/rest/oauth2-credential/callback`
   - Click en **"Save"** (botón rojo arriba a la derecha)

### 2. Verificar en Google Cloud Console

1. **Ve a Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Edita tu OAuth 2.0 Client ID**:
   - Click en el nombre de tu credencial OAuth 2.0
   - En la sección **"URIs de redireccionamiento autorizados"**
   - Verifica que tengas: `http://localhost:5678/rest/oauth2-credential/callback`
   - Si tienes `0.0.0.0`, elimínalo y agrega `localhost`
   - Click en **"Guardar"**

### 3. Intentar Autorizar de Nuevo

1. **En n8n**:
   - Después de guardar los cambios
   - Click en el botón **"Sign in with Google"** (botón azul con logo de Google)
   - Se abrirá una nueva ventana de autorización
   - Selecciona tu cuenta de Google
   - Click en **"Permitir"**

## ⚠️ Verificación Importante

**Ambos lugares deben tener EXACTAMENTE la misma URL**:

✅ **En Google Cloud Console**:
```
http://localhost:5678/rest/oauth2-credential/callback
```

✅ **En n8n**:
```
http://localhost:5678/rest/oauth2-credential/callback
```

**Deben ser IDÉNTICAS** (incluyendo http vs https, localhost vs 0.0.0.0, etc.)

## 🔍 Por Qué Ocurre Este Error

Google rechaza `0.0.0.0` porque:
- `0.0.0.0` es una dirección interna del contenedor Docker
- Google requiere una URL válida y accesible
- `localhost` es la forma correcta de acceder desde fuera del contenedor

## 📝 Checklist de Corrección

- [ ] En n8n: OAuth Redirect URL = `http://localhost:5678/rest/oauth2-credential/callback`
- [ ] En Google Cloud: Redirect URI = `http://localhost:5678/rest/oauth2-credential/callback`
- [ ] Ambos son exactamente iguales
- [ ] Guardaste los cambios en ambos lugares
- [ ] Intentaste autorizar de nuevo

## 🎯 Si el Error Persiste

1. **Limpia el caché del navegador**:
   - Cierra todas las ventanas de Google
   - Limpia la caché del navegador
   - Intenta de nuevo

2. **Verifica que tu email esté en Test Users**:
   - Ve a la pantalla de consentimiento en Google Cloud Console
   - Verifica que tu email esté en la lista de "Test users"
   - Si no está, agrégalo

3. **Verifica que las APIs estén habilitadas**:
   - Google Sheets API
   - Google Drive API

4. **Espera unos minutos**:
   - A veces Google tarda unos minutos en actualizar los cambios

## ✅ Después de Corregir

Una vez que ambos lugares tengan `localhost`:
1. Guarda en n8n
2. Guarda en Google Cloud Console
3. Intenta autorizar de nuevo
4. Debería funcionar correctamente

**El problema es el `0.0.0.0` - cámbialo a `localhost` en ambos lugares y funcionará.** 🚀
