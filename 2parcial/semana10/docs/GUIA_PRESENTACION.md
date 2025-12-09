# Guía de Presentación - Semana 10/11

## 📋 Checklist Pre-Presentación

Antes de la presentación, asegúrate de que todo esté funcionando:

### 1. Infraestructura Docker ✅
```bash
cd semana10
docker-compose ps
```

**Debe mostrar:**
- ✅ `rabbitmq-semana10` - Running
- ✅ `redis-semana10` - Running  
- ✅ `postgres-arquitecto-semana10` - Running
- ✅ `postgres-verificacion-semana10` - Running

### 2. Migraciones Ejecutadas ✅
```bash
# Terminal 1 - Microservicio Arquitecto
cd microservicio-arquitecto
npm run migration:run

# Terminal 2 - Microservicio Verificación
cd microservicio-verificacion
npm run migration:run
```

### 3. Microservicios Corriendo ✅
Abre 3 terminales y ejecuta:

**Terminal 1 - API Gateway:**
```bash
cd semana10/api-gateway
npm run start:dev
```
**Esperado:** `API Gateway ejecutándose en puerto 3000`

**Terminal 2 - Microservicio Arquitecto:**
```bash
cd semana10/microservicio-arquitecto
npm run start:dev
```
**Esperado:** `Microservicio Arquitecto ejecutándose en puerto 3001`

**Terminal 3 - Microservicio Verificación:**
```bash
cd semana10/microservicio-verificacion
npm run start:dev
```
**Esperado:** `Microservicio Verificación ejecutándose en puerto 3002`

### 4. Verificación Rápida
```bash
# Verificar que el API Gateway responde
curl http://localhost:3000/arquitectos

# Debe retornar: [] (array vacío, pero sin error)
```

---

## 🎯 Estructura de la Presentación (15-20 minutos)

### Parte 1: Explicación de Arquitectura (5 min)

#### 1.1 Componentes del Sistema
**Muestra el diagrama de arquitectura:**
```
Cliente → API Gateway (REST) → RabbitMQ → Microservicios → Bases de Datos
```

**Explica:**
- ✅ **API Gateway**: Punto único de entrada REST, no tiene BD propia
- ✅ **Microservicio Arquitecto**: Entidad Maestra con BD PostgreSQL independiente (puerto 5433)
- ✅ **Microservicio Verificación**: Entidad Transaccional con BD PostgreSQL independiente (puerto 5434)
- ✅ **RabbitMQ**: Comunicación asíncrona entre microservicios
- ✅ **Redis**: Consumidor Idempotente para evitar duplicados

#### 1.2 Restricción Crítica
**Demuestra que NO hay comunicación HTTP directa:**
```bash
# Muestra el código
cat microservicio-verificacion/src/verificacion/verificacion.service.ts | grep -i "http\|axios\|fetch"
# Resultado: No debe encontrar nada
```

**Explica:**
- Toda comunicación entre microservicios es vía RabbitMQ
- El microservicio Verificación usa `rabbitMQService.sendMessage()` para comunicarse con Arquitecto

---

### Parte 2: Demostración Funcional - Happy Path (5 min)

#### 2.1 Crear un Arquitecto
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "descripcion": "Arquitecto de prueba para demo",
    "especialidades": "Diseño residencial y comercial",
    "ubicacion": "Bogotá",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

**Guarda el ID del arquitecto creado** (ejemplo: `ARQUITECTO_ID="..."`)

#### 2.2 Verificar que el Arquitecto existe
```bash
curl http://localhost:3000/arquitectos
```

#### 2.3 Crear una Verificación
```bash
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\"
  }"
```

**Explica:**
- El API Gateway genera automáticamente una `idempotency_key`
- El microservicio Verificación verifica que el arquitecto existe vía RabbitMQ
- Se crea la verificación en la BD del microservicio Verificación

#### 2.4 Verificar Eventos en RabbitMQ
Abre http://localhost:15672 (admin/admin123) y muestra:
- Cola `arquitecto.queue` con mensajes
- Cola `verificacion.queue` con mensajes
- Exchange `arquitecto.exchange` con bindings

---

### Parte 3: Demo de Resiliencia - Consumidor Idempotente (5-7 min)

#### 3.1 Prueba de Idempotencia
**Explica el problema:**
- RabbitMQ garantiza "At-least-once delivery"
- Si la red falla antes del ACK, el mensaje se duplica
- Sin idempotencia, se crearían verificaciones duplicadas

**Demuestra la solución:**

**Paso 1:** Crear una verificación con `idempotency_key` explícita:
```bash
IDEMPOTENCY_KEY="test-demo-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Guarda el ID de la verificación creada** (ejemplo: `VERIFICACION_ID="..."`)

**Paso 2:** Enviar la MISMA solicitud múltiples veces:
```bash
# Enviar 3 veces la misma solicitud
for i in {1..3}; do
  echo "Intento $i:"
  curl -X POST http://localhost:3000/verificaciones \
    -H "Content-Type: application/json" \
    -d "{
      \"arquitecto_id\": \"$ARQUITECTO_ID\",
      \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
      \"estado\": \"pendiente\",
      \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
    }"
  echo ""
done
```

**Resultado esperado:**
- ✅ Solo se crea UNA verificación en la base de datos
- ✅ Las demás solicitudes retornan el mismo resultado (cacheado de Redis)
- ✅ No hay duplicados

**Paso 3:** Verificar en Redis:
```bash
docker exec -it redis-semana10 redis-cli
KEYS idempotency:*
GET idempotency:test-demo-*
```

**Paso 4:** Verificar en la base de datos:
```bash
# Conectar a PostgreSQL de Verificación
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db

# Ejecutar:
SELECT id, arquitecto_id, estado, created_at FROM verificaciones;

# Debe mostrar solo UNA verificación con ese arquitecto_id
```

#### 3.2 Explicar la Implementación
**Muestra el código:**
```typescript
// microservicio-verificacion/src/verificacion/verificacion.service.ts
// Líneas 38-43: Verificación de idempotencia
const processed = await this.redisService.checkIdempotency(idempotency_key);
if (processed) {
  this.logger.warn(`Solicitud duplicada detectada: ${idempotency_key}`);
  return processed; // Retorna resultado cacheado
}
```

**Explica:**
- Redis almacena el resultado procesado con TTL de 24 horas
- Si la clave existe, retorna el resultado sin tocar la BD
- Garantiza procesamiento exactamente una vez

---

### Parte 4: Preguntas Técnicas (3-5 min)

**Prepara respuestas para estas preguntas comunes:**

#### ¿Por qué elegiste Idempotent Consumer?
- **Respuesta:** Es crítico para sistemas transaccionales donde procesar un pago o verificación dos veces sería catastrófico. Redis permite verificación rápida (O(1)) y es perfecto para este caso de uso.

#### ¿Cómo maneja el sistema si Redis falla?
- **Respuesta:** El código tiene manejo de errores que permite el procesamiento si Redis no está disponible (línea 69-71 de redis.service.ts), pero en producción se recomienda tener Redis en alta disponibilidad.

#### ¿Qué pasa si dos solicitudes llegan simultáneamente con la misma clave?
- **Respuesta:** Redis es atómico. La primera solicitud guarda la clave, la segunda la encuentra y retorna el resultado cacheado. No hay condición de carrera.

#### ¿Por qué no usaste HTTP directo entre microservicios?
- **Respuesta:** La restricción del taller prohíbe comunicación HTTP directa para el flujo crítico. RabbitMQ proporciona desacoplamiento, resiliencia y garantías de entrega.

#### ¿Cómo escalarías este sistema?
- **Respuesta:** 
  - API Gateway: Múltiples instancias con load balancer
  - Microservicios: Escalar horizontalmente, cada instancia consume de la misma cola
  - RabbitMQ: Cluster para alta disponibilidad
  - Redis: Cluster o Sentinel para alta disponibilidad

---

## 🛠️ Comandos de Respaldo

Si algo falla durante la presentación:

### Reiniciar todo:
```bash
# Detener todo
docker-compose down
# O solo los microservicios (Ctrl+C en cada terminal)

# Reiniciar infraestructura
docker-compose up -d

# Esperar 10 segundos
sleep 10

# Reiniciar microservicios
# (En las 3 terminales respectivas)
```

### Ver logs si hay problemas:
```bash
# Logs de PostgreSQL
docker-compose logs postgres-arquitecto
docker-compose logs postgres-verificacion

# Logs de RabbitMQ
docker-compose logs rabbitmq

# Logs de Redis
docker-compose logs redis
```

### Verificar conexiones:
```bash
# Verificar que PostgreSQL acepta conexiones
docker exec -it postgres-arquitecto-semana10 pg_isready -U arquitecto_user -d arquitecto_db
docker exec -it postgres-verificacion-semana10 pg_isready -U verificacion_user -d verificacion_db

# Verificar RabbitMQ
curl http://localhost:15672/api/overview -u admin:admin123

# Verificar Redis
docker exec -it redis-semana10 redis-cli ping
```

---

## 📊 Métricas para Mostrar

### RabbitMQ Management (http://localhost:15672)
- **Overview**: Muestra conexiones activas
- **Queues**: Muestra mensajes en colas
- **Exchanges**: Muestra bindings y mensajes publicados

### Logs de Microservicios
Muestra los logs en tiempo real para demostrar:
- Conexión a RabbitMQ
- Procesamiento de mensajes
- Detección de idempotencia
- Publicación de eventos

---

## ✅ Checklist Final

Antes de presentar, verifica:

- [ ] Todos los contenedores Docker están corriendo
- [ ] Las migraciones están ejecutadas
- [ ] Los 3 microservicios están corriendo sin errores
- [ ] Puedes crear un arquitecto vía API Gateway
- [ ] Puedes crear una verificación vía API Gateway
- [ ] RabbitMQ Management está accesible
- [ ] Redis está funcionando
- [ ] Tienes los comandos de demo preparados
- [ ] Tienes respuestas preparadas para preguntas técnicas

---

## 🎬 Orden Sugerido de Demostración

1. **Mostrar arquitectura** (diagrama en README o dibujado)
2. **Mostrar código** que demuestra no hay HTTP directo
3. **Crear arquitecto** (Happy Path)
4. **Crear verificación** (Happy Path)
5. **Mostrar RabbitMQ** (colas y mensajes)
6. **Demo de idempotencia** (enviar misma solicitud 3 veces)
7. **Mostrar Redis** (claves de idempotencia)
8. **Verificar BD** (solo una verificación creada)
9. **Responder preguntas**

---

## 📝 Notas Adicionales

- **Tiempo total estimado**: 15-20 minutos
- **Tiempo de demo funcional**: 5 minutos
- **Tiempo de demo de resiliencia**: 5-7 minutos
- **Tiempo de preguntas**: 3-5 minutos

**Consejo:** Practica la demo completa al menos una vez antes de la presentación para asegurar que todo funciona correctamente.

