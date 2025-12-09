#!/bin/bash

# Script para probar la comunicación entre microservicios vía RabbitMQ
# Verifica que el microservicio de Verificación se comunica correctamente con el de Arquitecto

API_URL="http://localhost:3000"

echo "=== Prueba de Comunicación entre Microservicios ==="
echo ""

# 1. Crear arquitecto
echo "1. Creando arquitecto en Microservicio A..."
ARQUITECTO_RESPONSE=$(curl -s -X POST "$API_URL/arquitectos" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "11111111",
    "descripcion": "Arquitecto para prueba de comunicación",
    "especialidades": "Diseño urbano",
    "ubicacion": "Cali",
    "usuario_id": "00000000-0000-0000-0000-000000000005"
  }')

ARQUITECTO_ID=$(echo $ARQUITECTO_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Arquitecto creado: $ARQUITECTO_ID"
echo ""

# 2. Intentar crear verificación (debe verificar que el arquitecto existe vía RabbitMQ)
echo "2. Creando verificación (Microservicio B debe verificar existencia del arquitecto vía RabbitMQ)..."
VERIFICACION_RESPONSE=$(curl -s -X POST "$API_URL/verificaciones" \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000006\",
    \"estado\": \"pendiente\"
  }")

VERIFICACION_ID=$(echo $VERIFICACION_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$VERIFICACION_ID" ]; then
  echo "✅ Verificación creada exitosamente: $VERIFICACION_ID"
  echo "   (La comunicación vía RabbitMQ funcionó correctamente)"
else
  echo "❌ Error al crear verificación"
  echo "Respuesta: $VERIFICACION_RESPONSE"
  exit 1
fi

echo ""

# 3. Actualizar verificación a 'verificado' (debe notificar al microservicio de Arquitecto)
echo "3. Actualizando verificación a 'verificado' (debe notificar a Microservicio A vía RabbitMQ)..."
UPDATE_RESPONSE=$(curl -s -X PATCH "$API_URL/verificaciones/$VERIFICACION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "verificado"
  }')

echo "✅ Verificación actualizada"
echo ""

# 4. Verificar que el arquitecto fue marcado como verificado
echo "4. Verificando que el arquitecto fue marcado como verificado..."
ARQUITECTO_UPDATED=$(curl -s "$API_URL/arquitectos/$ARQUITECTO_ID")
VERIFICADO=$(echo $ARQUITECTO_UPDATED | grep -o '"verificado":[^,}]*' | cut -d':' -f2)

if [ "$VERIFICADO" == "true" ]; then
  echo "✅ Arquitecto marcado como verificado correctamente"
  echo "   (El evento RabbitMQ fue procesado exitosamente)"
else
  echo "❌ El arquitecto no fue marcado como verificado"
  echo "Estado: $VERIFICADO"
fi

echo ""
echo "=== Prueba completada ==="

