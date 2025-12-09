#!/bin/bash

# Script para probar la idempotencia del consumidor
# Envía la misma solicitud múltiples veces y verifica que solo se procesa una vez

API_URL="http://localhost:3000"
IDEMPOTENCY_KEY="test-key-$(date +%s)"

echo "=== Prueba de Idempotencia ==="
echo "Clave de idempotencia: $IDEMPOTENCY_KEY"
echo ""

# Crear arquitecto primero
echo "1. Creando arquitecto..."
ARQUITECTO_RESPONSE=$(curl -s -X POST "$API_URL/arquitectos" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "descripcion": "Arquitecto de prueba",
    "especialidades": "Diseño residencial",
    "ubicacion": "Bogotá",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }')

ARQUITECTO_ID=$(echo $ARQUITECTO_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Arquitecto creado con ID: $ARQUITECTO_ID"
echo ""

# Enviar la misma solicitud de verificación 3 veces
echo "2. Enviando la misma solicitud de verificación 3 veces..."
for i in {1..3}; do
  echo "Intento $i:"
  RESPONSE=$(curl -s -X POST "$API_URL/verificaciones" \
    -H "Content-Type: application/json" \
    -d "{
      \"arquitecto_id\": \"$ARQUITECTO_ID\",
      \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
      \"estado\": \"pendiente\",
      \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
    }")
  
  VERIFICACION_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "  Respuesta: Verificación ID = $VERIFICACION_ID"
  sleep 1
done

echo ""
echo "3. Verificando que solo existe una verificación..."
VERIFICACIONES=$(curl -s "$API_URL/verificaciones")
COUNT=$(echo $VERIFICACIONES | grep -o '"id"' | wc -l)
echo "Total de verificaciones encontradas: $COUNT"

if [ "$COUNT" -eq 1 ]; then
  echo "✅ PRUEBA EXITOSA: Solo se procesó una verificación (idempotencia funcionando)"
else
  echo "❌ PRUEBA FALLIDA: Se procesaron múltiples verificaciones"
fi

