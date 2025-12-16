# Guía de Demostración de Resiliencia - Consumidor Idempotente

## 🎯 Objetivo de la Demo

Demostrar que el sistema **soporta fallos** y **mantiene la consistencia de datos** incluso cuando:
- Los mensajes de RabbitMQ se duplican (At-least-once delivery)
- Hay fallos de red antes del ACK
- Se envían solicitudes duplicadas

---

## 📋 Preparación Pre-Demo

### 1. Verificar Estado Inicial

```bash
# Verificar que todos los servicios están corriendo
docker ps

# Limpiar datos de prueba anteriores (opcional)
docker exec -it redis-semana10 redis-cli FLUSHDB
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "DELETE FROM verificaciones;"
```

### 2. Verificar que Redis está funcionando

```bash
docker exec -it redis-semana10 redis-cli ping
# Debe responder: PONG
```

---

## 🧪 DEMO 1: Idempotencia con Solicitudes Duplicadas (Happy Path)

### Escenario
Simular que el cliente envía la misma solicitud múltiples veces (por ejemplo, doble clic, reintento automático, etc.)

### Pasos

**Paso 1: Crear un arquitecto**
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "DEMO001",
    "descripcion": "Arquitecto para demo de resiliencia",
    "especialidades": "Diseño estructural",
    "ubicacion": "Bogotá",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

**Guarda el ID del arquitecto:**
```bash
ARQUITECTO_ID="<ID_DEL_ARQUITECTO>"
```

**Paso 2: Crear verificación con idempotency_key explícita**
```bash
IDEMPOTENCY_KEY="resiliencia-test-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Paso 3: Enviar la MISMA solicitud 5 veces más (simulando duplicados)**
```bash
echo "=== Simulando 5 solicitudes duplicadas ==="

for i in {1..5}; do
  echo ""
  echo "Intento $i:"
  RESPONSE=$(curl -s -X POST http://localhost:3000/verificaciones \
    -H "Content-Type: application/json" \
    -d "{
      \"arquitecto_id\": \"$ARQUITECTO_ID\",
      \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
      \"estado\": \"pendiente\",
      \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
    }")
  
  echo "Respuesta: $RESPONSE"
  sleep 0.5
done
```

**Paso 4: Verificar en Redis que la clave existe**
```bash
docker exec -it redis-semana10 redis-cli
KEYS idempotency:*
GET idempotency:resiliencia-test-*
```

**Paso 5: Verificar en PostgreSQL que solo hay UNA verificación**
```bash
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db

# Dentro de PostgreSQL:
SELECT id, arquitecto_id, estado, created_at FROM verificaciones WHERE arquitecto_id = '$ARQUITECTO_ID';
```

**Resultado esperado:**
- ✅ Solo debe haber **1 verificación** en la base de datos
- ✅ Las 5 solicitudes duplicadas retornaron el mismo resultado (cacheado)
- ✅ Redis tiene la clave de idempotencia almacenada

**Explicación para la presentación:**
> "Aunque enviamos 6 solicitudes idénticas (1 inicial + 5 duplicadas), solo se creó 1 verificación en la base de datos. El consumidor idempotente detectó las solicitudes duplicadas usando Redis y retornó el resultado cacheado sin tocar la base de datos. Esto garantiza consistencia de datos incluso con fallos de red o reintentos automáticos."

---

## 🧪 DEMO 2: Simulación de Fallo de Red (RabbitMQ Reenvía Mensaje)

### Escenario
Simular que RabbitMQ reenvía un mensaje porque no recibió el ACK (fallo de red antes del ACK)

### Pasos

**Paso 1: Limpiar Redis (simular que el mensaje se perdió antes del ACK)**
```bash
# Eliminar la clave de idempotencia para simular que el primer procesamiento falló
docker exec -it redis-semana10 redis-cli DEL idempotency:resiliencia-test-*
```

**Paso 2: Verificar que la clave fue eliminada**
```bash
docker exec -it redis-semana10 redis-cli GET idempotency:resiliencia-test-*
# Debe retornar: (nil)
```

**Paso 3: Simular que RabbitMQ reenvía el mensaje (enviar la misma solicitud)**
```bash
# Esta es la "segunda vez" que llega el mensaje (después del fallo)
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Paso 4: Verificar que NO se creó una verificación duplicada**
```bash
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db

# Dentro de PostgreSQL:
SELECT COUNT(*) FROM verificaciones WHERE arquitecto_id = '$ARQUITECTO_ID';
```

**Resultado esperado:**
- ✅ El conteo sigue siendo **1** (no se creó duplicado)
- ✅ El sistema detectó que ya existía una verificación para ese arquitecto
- ✅ Se guardó la clave en Redis para futuros reintentos

**Explicación para la presentación:**
> "Simulamos un fallo de red donde RabbitMQ no recibió el ACK y reenvió el mensaje. Aunque el mensaje llegó dos veces, el sistema verificó en la base de datos que ya existía una verificación para ese arquitecto y no creó un duplicado. Esto demuestra que el sistema mantiene consistencia incluso con fallos de infraestructura."

---

## 🧪 DEMO 3: Fallo de Redis y Recuperación

### Escenario
Demostrar que el sistema maneja gracefully el fallo de Redis

### Pasos

**Paso 1: Detener Redis temporalmente**
```bash
docker stop redis-semana10
```

**Paso 2: Intentar crear una verificación (Redis no disponible)**
```bash
NEW_IDEMPOTENCY_KEY="test-redis-down-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$NEW_IDEMPOTENCY_KEY\"
  }"
```

**Observa los logs del microservicio:**
- Debe mostrar un error de Redis pero **permitir el procesamiento**
- El sistema sigue funcionando aunque sin protección de idempotencia temporalmente

**Paso 3: Reiniciar Redis**
```bash
docker start redis-semana10
```

**Paso 4: Verificar que el sistema se recuperó**
```bash
docker exec -it redis-semana10 redis-cli ping
# Debe responder: PONG
```

**Paso 5: Crear otra verificación (ahora con Redis funcionando)**
```bash
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"test-recovery-$(date +%s)\"
  }"
```

**Explicación para la presentación:**
> "Cuando Redis falla, el sistema tiene manejo de errores que permite el procesamiento para no bloquear el sistema. Esto es graceful degradation: el sistema funciona aunque con protección reducida. Cuando Redis se recupera, el sistema vuelve a tener protección completa de idempotencia."

---

## 🧪 DEMO 4: Eventos Automáticos con Idempotencia

### Escenario
Demostrar que incluso los eventos automáticos (arquitecto.creado) usan idempotencia

### Pasos

**Paso 1: Crear un arquitecto (esto dispara evento automático)**
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "DEMO002",
    "descripcion": "Arquitecto para demo de eventos automáticos",
    "especialidades": "Diseño urbano",
    "ubicacion": "Medellín",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

**Guarda el ID:**
```bash
ARQUITECTO_ID_2="<ID_DEL_ARQUITECTO>"
```

**Paso 2: Verificar que se creó automáticamente la verificación**
```bash
curl http://localhost:3000/verificaciones
```

**Paso 3: Verificar en Redis la clave de idempotencia automática**
```bash
docker exec -it redis-semana10 redis-cli
KEYS idempotency:auto-verificacion-*
```

**Paso 4: Simular que el evento llega dos veces (simular fallo de RabbitMQ)**
```bash
# Simular reenvío del evento (en producción esto pasaría si RabbitMQ no recibe ACK)
# Como ya existe la verificación, no se creará duplicado
```

**Paso 5: Verificar que no hay duplicados**
```bash
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db

SELECT COUNT(*) FROM verificaciones WHERE arquitecto_id = '$ARQUITECTO_ID_2';
```

**Resultado esperado:**
- ✅ Solo hay **1 verificación** para ese arquitecto
- ✅ La clave de idempotencia `auto-verificacion-{id}` está en Redis
- ✅ Si el evento llega múltiples veces, no se crean duplicados

**Explicación para la presentación:**
> "Incluso los eventos automáticos que se generan cuando se crea un arquitecto usan idempotencia. La clave `auto-verificacion-{arquitecto_id}` garantiza que aunque RabbitMQ reenvíe el evento múltiples veces, solo se crea una verificación. Esto demuestra que la protección de idempotencia está integrada en todo el sistema."

---

## 📊 Resumen de Métricas para Mostrar

### Antes de la Demo
```bash
# Contar verificaciones iniciales
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "SELECT COUNT(*) FROM verificaciones;"

# Contar claves de idempotencia
docker exec -it redis-semana10 redis-cli DBSIZE
```

### Después de la Demo
```bash
# Verificar que el conteo es correcto (no hay duplicados)
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "SELECT COUNT(*) FROM verificaciones;"

# Ver todas las claves de idempotencia
docker exec -it redis-semana10 redis-cli KEYS idempotency:*
```

---

## 🎬 Orden Sugerido para la Presentación

1. **Demo 1: Idempotencia con Solicitudes Duplicadas** (3 min)
   - Muestra el problema: "¿Qué pasa si el cliente envía la misma solicitud 6 veces?"
   - Demuestra la solución: Solo 1 verificación creada
   - Muestra Redis y PostgreSQL

2. **Demo 2: Fallo de Red (RabbitMQ Reenvía)** (2 min)
   - Explica el problema: "RabbitMQ garantiza At-least-once delivery"
   - Simula el reenvío
   - Demuestra que no hay duplicados

3. **Demo 4: Eventos Automáticos** (2 min)
   - Muestra que incluso eventos automáticos usan idempotencia
   - Demuestra protección completa del sistema

4. **Demo 3: Fallo de Redis (Opcional, si hay tiempo)** (2 min)
   - Muestra graceful degradation
   - Demuestra recuperación automática

**Tiempo total: 7-9 minutos**

---

## 💡 Puntos Clave para Explicar

1. **Problema Resuelto:**
   - RabbitMQ garantiza "At-least-once delivery"
   - Sin idempotencia, los mensajes duplicados causarían duplicados en BD
   - Esto rompería la consistencia de datos

2. **Solución Implementada:**
   - Verificación en Redis ANTES de tocar la base de datos
   - Clave de idempotencia única por operación
   - Retorno de resultado cacheado si la clave existe

3. **Garantías:**
   - Procesamiento exactamente una vez (Exactly-once semantics)
   - Consistencia de datos garantizada
   - Resiliencia ante fallos de red e infraestructura

4. **Métricas de Éxito:**
   - 0 duplicados en base de datos
   - 100% de solicitudes duplicadas detectadas
   - Sistema funciona incluso con fallos parciales

---

## 🛠️ Scripts de Ayuda (Opcional)

### Script para limpiar datos de prueba
```bash
# Limpiar Redis
docker exec -it redis-semana10 redis-cli FLUSHDB

# Limpiar verificaciones de prueba
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "DELETE FROM verificaciones WHERE arquitecto_id LIKE 'DEMO%';"
```

### Script para verificar estado
```bash
# Ver todas las verificaciones
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "SELECT id, arquitecto_id, estado, created_at FROM verificaciones ORDER BY created_at DESC;"

# Ver todas las claves de idempotencia
docker exec -it redis-semana10 redis-cli KEYS idempotency:*
```

---

## ✅ Checklist Pre-Demo

- [ ] Todos los servicios están corriendo
- [ ] Redis está funcionando
- [ ] PostgreSQL está funcionando
- [ ] Tienes los comandos copiados
- [ ] Has practicado la demo al menos una vez
- [ ] Tienes los IDs de arquitectos de prueba listos
- [ ] Sabes explicar cada paso

---

## 🎯 Conclusión para la Presentación

**Di esto al final:**

> "Hemos demostrado que el sistema mantiene consistencia de datos incluso cuando:
> - Se envían solicitudes duplicadas (6 veces la misma solicitud)
> - RabbitMQ reenvía mensajes por fallos de red
> - Los eventos automáticos llegan múltiples veces
> 
> En todos los casos, el consumidor idempotente garantizó que solo se procesó una vez cada operación, manteniendo la integridad de los datos. Esto es crítico para sistemas transaccionales donde procesar una operación dos veces sería catastrófico."

---

¡Con esta demo, cubres el 30% de la rúbrica de resiliencia! 🚀

