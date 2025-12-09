#!/bin/bash

# Script para simular duplicación de mensajes RabbitMQ
# Simula el escenario donde un mensaje se duplica antes del ACK

API_URL="http://localhost:3000"

echo "=== Prueba de Duplicación de Mensajes ==="
echo ""

# Crear arquitecto
echo "1. Creando arquitecto..."
ARQUITECTO_RESPONSE=$(curl -s -X POST "$API_URL/arquitectos" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "87654321",
    "descripcion": "Arquitecto para prueba de duplicación",
    "especialidades": "Diseño comercial",
    "ubicacion": "Medellín",
    "usuario_id": "00000000-0000-0000-0000-000000000003"
  }')

ARQUITECTO_ID=$(echo $ARQUITECTO_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Arquitecto creado: $ARQUITECTO_ID"
echo ""

# Crear verificación con clave de idempotencia
IDEMPOTENCY_KEY="dup-test-$(date +%s)"
echo "2. Creando verificación con clave de idempotencia: $IDEMPOTENCY_KEY"

RESPONSE1=$(curl -s -X POST "$API_URL/verificaciones" \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000004\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }")

VERIFICACION_ID1=$(echo $RESPONSE1 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Primera solicitud - Verificación ID: $VERIFICACION_ID1"
echo ""

# Simular mensaje duplicado (misma clave de idempotencia)
echo "3. Simulando mensaje duplicado (misma clave de idempotencia)..."
RESPONSE2=$(curl -s -X POST "$API_URL/verificaciones" \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000004\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }")

VERIFICACION_ID2=$(echo $RESPONSE2 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Segunda solicitud (duplicado) - Verificación ID: $VERIFICACION_ID2"
echo ""

# Verificar resultados
if [ "$VERIFICACION_ID1" == "$VERIFICACION_ID2" ]; then
  echo "✅ PRUEBA EXITOSA: El mensaje duplicado fue detectado y se retornó el mismo resultado"
else
  echo "❌ PRUEBA FALLIDA: Se crearon verificaciones diferentes"
fi

echo ""
echo "4. Verificando total de verificaciones..."
VERIFICACIONES=$(curl -s "$API_URL/verificaciones")
COUNT=$(echo $VERIFICACIONES | grep -o '"id"' | wc -l)
echo "Total de verificaciones: $COUNT"

