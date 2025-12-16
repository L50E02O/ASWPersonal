# Guía Práctica de Presentación - Semana 10

## 🎯 Estructura de la Presentación (15-20 minutos)

---

## PARTE 1: Explicación Breve de la Arquitectura (3-4 minutos)

### 1.1 Diagrama de Arquitectura

**Muestra este diagrama (puedes dibujarlo o mostrar el del README):**

```
┌─────────────┐
│   Cliente   │ (Postman/Frontend)
└──────┬──────┘
       │ HTTP REST
       ▼
┌─────────────┐
│ API Gateway│ (Puerto 3000)
│  (NestJS)  │ - Punto único de entrada
│            │ - No tiene base de datos
└──────┬──────┘
       │ RabbitMQ (Transport.RMQ)
       ├──────────────┐
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│Microservicio│  │Microservicio│
│ Arquitecto │  │Verificación │
│  (Puerto    │  │  (Puerto    │
│    3001)    │  │    3002)    │
└──────┬──────┘  └──────┬───────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │ PostgreSQL  │
│ Arquitecto  │  │Verificación │
│  (Puerto    │  │  (Puerto    │
│    5433)    │  │    5434)    │
└─────────────┘  └──────┬───────┘
                       │
                       ▼
                 ┌─────────────┐
                 │    Redis    │
                 │ (Idempotencia)│
                 │  (Puerto    │
                 │    6379)    │
                 └─────────────┘
```

### 1.2 Explicación de Componentes

**Di esto mientras muestras el diagrama:**

1. **API Gateway (Puerto 3000)**
   - Punto único de entrada REST
   - Expone endpoints: `/arquitectos` y `/verificaciones`
   - No tiene base de datos propia
   - Enruta peticiones a microservicios vía RabbitMQ

2. **Microservicio Arquitecto (Puerto 3001) - Entidad Maestra**
   - Base de datos PostgreSQL independiente (puerto 5433)
   - Gestiona la entidad Arquitecto
   - Publica eventos: `arquitecto.creado`, `arquitecto.actualizado`
   - Escucha mensajes: `arquitecto.exists`, `arquitecto.findOne`

3. **Microservicio Verificación (Puerto 3002) - Entidad Transaccional**
   - Base de datos PostgreSQL independiente (puerto 5434)
   - Gestiona verificaciones de arquitectos
   - **Se comunica con Arquitecto SOLO vía RabbitMQ** (restricción crítica)
   - Publica eventos: `verificacion.solicitada`, `verificacion.completada`

4. **RabbitMQ**
   - Comunicación asíncrona entre microservicios
   - Colas: `arquitecto.queue`, `verificacion.queue`
   - Exchange: `arquitecto.exchange` (tipo topic)

5. **Redis**
   - Implementa **Consumidor Idempotente**
   - Almacena claves de idempotencia con TTL de 24 horas
   - Evita procesamiento duplicado de mensajes

### 1.3 Restricción Crítica y Comunicación por Eventos

**Muestra el código para demostrar que NO hay HTTP directo:**

```bash
# En la terminal, ejecuta:
cd microservicio-verificacion
grep -r "http://localhost:3001\|HttpService\|axios\|fetch" src/
```

**Resultado esperado:** No debe encontrar nada

**Explica:**
- El microservicio Verificación usa `rabbitMQService.sendMessage()` para comunicarse con Arquitecto
- Toda comunicación crítica es asíncrona vía RabbitMQ
- **Además, usa eventos de dominio:** cuando se crea un arquitecto, el evento `arquitecto.creado` se publica y el microservicio de Verificación lo escucha automáticamente
- Esto proporciona desacoplamiento y resiliencia

**Muestra el código del listener de eventos:**

```typescript
// microservicio-verificacion/src/verificacion/verificacion.controller.ts
@EventPattern('arquitecto.creado')
async handleArquitectoCreado(@Body() data: { id: string; usuario_id: string }) {
  return this.verificacionService.crearVerificacionAutomatica(data.id, data.usuario_id);
}
```

**Explica:**
- "Este es un ejemplo perfecto de comunicación asíncrona entre microservicios"
- "El microservicio Arquitecto publica un evento sin saber quién lo consume"
- "El microservicio Verificación escucha el evento y reacciona automáticamente"
- "Esto es desacoplamiento: los microservicios no se conocen directamente"

---

## PARTE 2: Demostración Funcional - Happy Path (5 minutos)

### 2.1 Verificar que Todo Está Corriendo

**Antes de empezar, verifica:**

```bash
# Verificar contenedores Docker
docker ps

# Debe mostrar 4 contenedores corriendo:
# - rabbitmq-semana10
# - redis-semana10
# - postgres-arquitecto-semana10
# - postgres-verificacion-semana10
```

### 2.2 Paso 1: Crear un Arquitecto

**Ejecuta este comando:**

```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "descripcion": "Arquitecto de prueba para demostración",
    "especialidades": "Diseño residencial y comercial",
    "ubicacion": "Bogotá",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

**Explica mientras ejecutas:**
- "El cliente envía una petición HTTP REST al API Gateway"
- "El Gateway enruta la petición al Microservicio Arquitecto vía RabbitMQ"
- "El microservicio crea el arquitecto en su base de datos PostgreSQL"
- "Se publica el evento `arquitecto.creado` en RabbitMQ"

**Guarda el ID del arquitecto:**
```bash
# Copia el ID de la respuesta, ejemplo:
ARQUITECTO_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### 2.3 Paso 2: Verificar que el Arquitecto Fue Creado

```bash
curl http://localhost:3000/arquitectos
```

**Explica:**
- "El API Gateway consulta al microservicio Arquitecto vía RabbitMQ"
- "Retorna la lista de arquitectos desde la base de datos independiente"

### 2.4 Paso 3: Verificar que se Creó Automáticamente una Verificación

**IMPORTANTE:** Cuando se crea un arquitecto, el microservicio de Verificación **automáticamente** crea una verificación en estado "pendiente" escuchando el evento `arquitecto.creado`.

**Verifica que la verificación se creó automáticamente:**

```bash
curl http://localhost:3000/verificaciones
```

**Explica mientras ejecutas:**
- "Cuando se creó el arquitecto, se publicó el evento `arquitecto.creado` en RabbitMQ"
- "El microservicio de Verificación escucha este evento mediante `@EventPattern('arquitecto.creado')`"
- "Automáticamente crea una verificación en estado 'pendiente' para el nuevo arquitecto"
- "Esto demuestra comunicación asíncrona entre microservicios vía eventos de dominio"
- "La verificación se crea con idempotencia para evitar duplicados si el evento llega múltiples veces"

**Guarda el ID de la verificación:**
```bash
VERIFICACION_ID="<ID_DE_LA_VERIFICACION>"
```

**Alternativa: Crear una verificación manualmente (opcional)**

Si quieres crear una verificación adicional manualmente:

```bash
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\"
  }"
```

**Nota:** Esto fallará si ya existe una verificación automática para ese arquitecto (validación de negocio).

### 2.5 Paso 4: Mostrar RabbitMQ Management

**Abre en el navegador:** http://localhost:15672
- Usuario: `admin`
- Contraseña: `admin123`

**Muestra:**
1. **Overview**: Conexiones activas de los microservicios
2. **Queues**: 
   - `arquitecto.queue` - Mensajes de consultas
   - `verificacion.queue` - Mensajes de verificaciones
3. **Exchanges**: 
   - `arquitecto.exchange` - Eventos publicados
4. **Bindings**: Cómo están conectadas las colas al exchange

**Explica:**
- "Aquí vemos la comunicación asíncrona entre microservicios"
- "Los mensajes están en las colas esperando ser procesados"
- "El exchange enruta los eventos a las colas correspondientes"

---

## PARTE 3: Prueba de Resiliencia - Consumidor Idempotente (5-7 minutos)

> **📖 Guía Completa:** Ver [DEMO_RESILIENCIA.md](./DEMO_RESILIENCIA.md) para todos los escenarios de prueba detallados.

### 3.1 Explicar el Problema

**Di esto:**

"RabbitMQ garantiza 'At-least-once delivery'. Esto significa que si la red falla antes de que el consumidor envíe el ACK, el mensaje se reenvía. Sin idempotencia, esto causaría que se procese la misma verificación dos veces, creando duplicados en la base de datos."

**El problema NO es que el sistema falle, sino demostrar que:**
- ✅ **Aunque** los mensajes se dupliquen, el sistema NO procesa dos veces
- ✅ **Aunque** haya fallos de red, la consistencia se mantiene
- ✅ **Aunque** Redis falle temporalmente, el sistema sigue funcionando

**Muestra el código del problema:**

```typescript
// Sin idempotencia (PROBLEMA):
async create(createVerificacionDto) {
  // Si el mensaje llega dos veces, se crean 2 verificaciones
  const verificacion = await this.repository.save(createVerificacionDto);
  return verificacion;
}
```

### 3.2 Demostrar la Solución

**Paso 1: Crear una verificación con idempotency_key explícita**

```bash
# Generar una clave de idempotencia única
IDEMPOTENCY_KEY="demo-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Guarda el ID de la verificación creada:**
```bash
VERIFICACION_ID="<ID_DE_LA_VERIFICACION>"
```

**Paso 2: Enviar la MISMA solicitud 3 veces más**

```bash
echo "=== Enviando la misma solicitud 3 veces ==="

for i in {1..3}; do
  echo ""
  echo "Intento $i:"
  curl -X POST http://localhost:3000/verificaciones \
    -H "Content-Type: application/json" \
    -d "{
      \"arquitecto_id\": \"$ARQUITECTO_ID\",
      \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
      \"estado\": \"pendiente\",
      \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
    }"
  sleep 1
done
```

**Resultado esperado:**
- ✅ La primera solicitud crea la verificación
- ✅ Las siguientes 3 retornan el **mismo resultado** (cacheado)
- ✅ **NO se crean verificaciones duplicadas**

**Explica mientras ejecutas:**
- "Cada solicitud tiene la misma `idempotency_key`"
- "La primera se procesa y guarda en Redis"
- "Las siguientes encuentran la clave en Redis y retornan el resultado cacheado"
- "El efecto en la base de datos ocurre exactamente una vez"

### 3.3 Verificar en Redis

**Abre una nueva terminal y ejecuta:**

```bash
docker exec -it redis-semana10 redis-cli

# Dentro de Redis:
KEYS idempotency:*
GET idempotency:demo-*
```

**Muestra:**
- La clave existe en Redis
- El valor contiene el resultado de la verificación procesada
- TTL (tiempo de vida) de la clave

**Explica:**
- "Redis almacena el resultado procesado con TTL de 24 horas"
- "Si la clave existe, retornamos el resultado sin tocar la base de datos"
- "Esto garantiza idempotencia incluso si RabbitMQ reenvía el mensaje"

### 3.4 Verificar en la Base de Datos

**Ejecuta:**

```bash
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db

# Dentro de PostgreSQL:
SELECT id, arquitecto_id, estado, created_at FROM verificaciones WHERE arquitecto_id = '$ARQUITECTO_ID';
```

**Resultado esperado:**
- ✅ Solo debe haber **UNA** verificación para ese arquitecto
- ✅ Aunque enviamos la solicitud 4 veces, solo se creó una vez

**Explica:**
- "Aunque enviamos 6 solicitudes idénticas (1 inicial + 5 duplicadas), solo hay 1 registro en la BD"
- "El consumidor idempotente protegió el sistema de duplicados"
- "Esto es crítico para operaciones transaccionales como pagos o verificaciones"
- **"Esto demuestra que el sistema soporta fallos (mensajes duplicados) y mantiene consistencia de datos"**

### 3.6 Demo Adicional: Simular Fallo de RabbitMQ (Opcional)

**Para demostrar resiliencia más avanzada, puedes simular que RabbitMQ reenvía un mensaje:**

```bash
# Eliminar la clave de Redis (simular que el primer procesamiento falló antes del ACK)
docker exec -it redis-semana10 redis-cli DEL idempotency:$IDEMPOTENCY_KEY

# Verificar que fue eliminada
docker exec -it redis-semana10 redis-cli GET idempotency:$IDEMPOTENCY_KEY
# Debe retornar: (nil)

# Simular que RabbitMQ reenvía el mensaje (segunda vez)
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"

# Verificar que NO se creó duplicado (el sistema detecta que ya existe en BD)
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db -c "SELECT COUNT(*) FROM verificaciones WHERE arquitecto_id = '$ARQUITECTO_ID';"
```

**Explica:**
- "Simulamos un fallo donde RabbitMQ no recibió el ACK y reenvió el mensaje"
- "Aunque el mensaje llegó dos veces, el sistema verificó en la BD que ya existía"
- "No se creó duplicado, manteniendo consistencia"

### 3.5 Mostrar el Código de Implementación

**Muestra el código clave:**

```typescript
// microservicio-verificacion/src/verificacion/verificacion.service.ts

async create(createVerificacionDto: CreateVerificacionDto) {
  const { idempotency_key } = createVerificacionDto;

  // 1. Verificar idempotencia ANTES de procesar
  const processed = await this.redisService.checkIdempotency(idempotency_key);
  if (processed) {
    this.logger.warn(`Solicitud duplicada detectada: ${idempotency_key}`);
    return processed; // Retorna resultado cacheado
  }

  // 2. Procesar la solicitud
  const verificacion = await this.verificacionRepository.save(...);

  // 3. Guardar resultado en Redis
  await this.redisService.saveIdempotency(idempotency_key, verificacion);

  return verificacion;
}
```

**Explica:**
- "Verificamos Redis ANTES de tocar la base de datos"
- "Si la clave existe, retornamos el resultado cacheado"
- "Si no existe, procesamos y guardamos en Redis"
- "Esto garantiza procesamiento exactamente una vez"

---

## PARTE 4: Respuestas a Preguntas Técnicas (3-5 minutos)

### Pregunta 1: ¿Por qué elegiste Idempotent Consumer?

**Respuesta:**
"Elegí esta estrategia porque es crítica para sistemas transaccionales. En nuestro caso, procesar una verificación dos veces podría causar problemas de negocio. Redis permite verificación O(1) muy rápida y es perfecto para este caso de uso. Además, es más simple que implementar Sagas o Outbox con CDC, pero igualmente efectivo para garantizar idempotencia."

### Pregunta 2: ¿Cómo maneja el sistema si Redis falla?

**Respuesta:**
"El código tiene manejo de errores que permite el procesamiento si Redis no está disponible (líneas 68-71 de redis.service.ts). En producción, se recomienda tener Redis en alta disponibilidad con Sentinel o Cluster. Si Redis falla, el sistema sigue funcionando pero pierde la protección de idempotencia temporalmente."

### Pregunta 3: ¿Qué pasa si dos solicitudes llegan simultáneamente con la misma clave?

**Respuesta:**
"Redis es atómico. La primera solicitud que llega guarda la clave. La segunda encuentra la clave y retorna el resultado cacheado. No hay condición de carrera porque Redis garantiza atomicidad en operaciones SET y GET."

### Pregunta 4: ¿Por qué no usaste HTTP directo entre microservicios?

**Respuesta:**
"La restricción del taller prohíbe comunicación HTTP directa para el flujo crítico. RabbitMQ proporciona desacoplamiento, resiliencia y garantías de entrega. Además, permite escalar horizontalmente: múltiples instancias del mismo microservicio pueden consumir de la misma cola."

### Pregunta 5: ¿Cómo escalarías este sistema?

**Respuesta:**
- **API Gateway**: Múltiples instancias con load balancer (Nginx/HAProxy)
- **Microservicios**: Escalar horizontalmente, cada instancia consume de la misma cola RabbitMQ
- **RabbitMQ**: Cluster para alta disponibilidad
- **Redis**: Cluster o Sentinel para alta disponibilidad
- **PostgreSQL**: Read replicas para consultas, master para escrituras

### Pregunta 6: ¿Qué otros patrones consideraste?

**Respuesta:**
"Consideré Transactional Outbox con CDC, pero requiere configuración más compleja (triggers de PostgreSQL, Debezium, etc.). También consideré Sagas orquestadas con Temporal.io, pero es más pesado para este caso de uso. El Consumidor Idempotente es la solución más simple y efectiva para nuestro problema específico."

### Pregunta 7: ¿Cómo garantizas la consistencia entre microservicios?

**Respuesta:**
"Usamos eventos de dominio asíncronos. Cuando se completa una verificación, se publica el evento `verificacion.completada` que el microservicio Arquitecto consume para actualizar su estado. Esto es eventual consistency, que es apropiado para este dominio. Para operaciones que requieren consistencia fuerte, usaríamos Sagas o transacciones distribuidas."

---

## 📋 Checklist Pre-Presentación

Antes de presentar, verifica:

- [ ] Todos los contenedores Docker están corriendo (`docker ps`)
- [ ] Las migraciones están ejecutadas en ambos microservicios
- [ ] Los 3 microservicios están corriendo sin errores
- [ ] Puedes crear un arquitecto vía API Gateway
- [ ] Puedes crear una verificación vía API Gateway
- [ ] RabbitMQ Management está accesible (http://localhost:15672)
- [ ] Redis está funcionando (`docker exec redis-semana10 redis-cli ping`)
- [ ] Tienes los comandos preparados en una terminal
- [ ] Tienes el navegador abierto en RabbitMQ Management
- [ ] Conoces las respuestas a las preguntas técnicas

---

## 🎬 Orden Sugerido de Demostración

1. **Mostrar diagrama de arquitectura** (2 min)
2. **Demostrar que NO hay HTTP directo** (1 min)
3. **Crear arquitecto** - Happy Path (1 min)
4. **Crear verificación** - Happy Path (1 min)
5. **Mostrar RabbitMQ Management** (1 min)
6. **Explicar problema de idempotencia** (1 min)
7. **Demo de idempotencia** - Enviar misma solicitud 4 veces (2 min)
8. **Mostrar Redis** - Claves de idempotencia (1 min)
9. **Mostrar PostgreSQL** - Solo 1 verificación creada (1 min)
10. **Mostrar código de implementación** (1 min)
11. **Responder preguntas** (3-5 min)

**Tiempo total: 15-20 minutos**

---

## 🛠️ Comandos de Respaldo

Si algo falla durante la presentación:

```bash
# Reiniciar todo
docker-compose restart

# Ver logs si hay problemas
docker-compose logs -f [nombre-servicio]

# Verificar conexiones
docker exec -it postgres-arquitecto-semana10 pg_isready -U arquitecto_user -d arquitecto_db
docker exec -it redis-semana10 redis-cli ping
```

---

## 💡 Consejos para la Presentación

1. **Practica la demo completa** al menos una vez antes
2. **Ten los comandos copiados** en un archivo de texto para pegar rápido
3. **Abre todas las ventanas** antes de empezar (terminales, RabbitMQ, etc.)
4. **Explica mientras ejecutas**, no solo ejecutes
5. **Muestra confianza** en las decisiones técnicas
6. **Si algo falla**, mantén la calma y usa los comandos de respaldo

¡Éxito en tu presentación! 🚀

