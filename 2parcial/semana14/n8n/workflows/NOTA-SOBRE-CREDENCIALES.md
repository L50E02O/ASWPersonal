# Nota Importante: OAuth Redirect URL en Workflows JSON

## ⚠️ Información Importante

El **OAuth Redirect URL** **NO está en el archivo JSON del workflow**. 

El workflow JSON solo **referencia** la credencial de Google Sheets por nombre/ID, pero **NO contiene** la configuración de la credencial (como OAuth Redirect URL, Client ID, Client Secret).

## 📝 Dónde Está Realmente

El OAuth Redirect URL está en la **credencial** de Google Sheets, que se almacena por separado en n8n. Para cambiarlo:

1. **Desde el nodo**: Click en el icono del lápiz (✏️) junto a "Credential to connect with"
2. **Desde Settings**: Settings → Credentials → Edita tu credencial de Google Sheets

## ✅ El Workflow JSON Está Correcto

El archivo `2-sincronizacion-google-sheets.json` está correcto tal como está. No contiene ninguna URL que necesite ser cambiada.

Las credenciales (incluyendo OAuth Redirect URL) se configuran en la interfaz de n8n, no en el JSON del workflow.
