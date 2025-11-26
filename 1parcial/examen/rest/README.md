# REST API - Aplicación de Conferencias

API REST desarrollada con NestJS para la gestión de usuarios, conferencias y agendas.

## Tecnologías

- **NestJS**: Framework para Node.js
- **TypeORM**: ORM para TypeScript
- **SQLite**: Base de datos
- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de objetos
- **Socket.IO**: WebSockets para notificaciones en tiempo real
- **@nestjs/websockets**: Integración de WebSockets con NestJS

## Instalación

```bash
cd rest
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

## Estructura de Endpoints

### Base URL
```
http://localhost:3000
```

## Endpoints - Usuarios

### 1. Crear Usuario
**POST** `/usuarios`

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "1234567890",
  "password": "password123"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "uuid-generado",
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "1234567890",
  "password": "password123",
  "fechaRegistro": "2024-01-15T10:00:00.000Z"
}
```

### 2. Obtener Todos los Usuarios
**GET** `/usuarios`

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "1234567890",
    "fechaRegistro": "2024-01-15T10:00:00.000Z",
    "conferencias": [],
    "agendas": []
  }
]
```

### 3. Obtener Usuario por ID
**GET** `/usuarios/:id`

**Ejemplo:** `GET /usuarios/123e4567-e89b-12d3-a456-426614174000`

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "1234567890",
  "fechaRegistro": "2024-01-15T10:00:00.000Z",
  "conferencias": [],
  "agendas": []
}
```

### 4. Buscar Usuario por Email
**GET** `/usuarios/email/:correo`

**Ejemplo:** `GET /usuarios/email/juan@example.com`

### 5. Actualizar Usuario
**PATCH** `/usuarios/:id`

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "0987654321"
}
```

**Respuesta (200 OK):** Usuario actualizado

### 6. Eliminar Usuario
**DELETE** `/usuarios/:id`

**Respuesta (204 No Content)**

---

## Endpoints - Conferencias

### 1. Crear Conferencia
**POST** `/conferencias`

**Body (JSON):**
```json
{
  "titulo": "Conferencia de TypeScript",
  "descripcion": "Aprende TypeScript desde cero",
  "fechaInicio": "2024-12-15T10:00:00.000Z",
  "fechaFin": "2024-12-15T18:00:00.000Z",
  "ubicacion": "Auditorio Principal",
  "precio": 50000,
  "capacidadMaxima": 100,
  "organizadorId": "uuid-del-usuario-organizador"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "uuid-generado",
  "titulo": "Conferencia de TypeScript",
  "descripcion": "Aprende TypeScript desde cero",
  "fechaInicio": "2024-12-15T10:00:00.000Z",
  "fechaFin": "2024-12-15T18:00:00.000Z",
  "ubicacion": "Auditorio Principal",
  "precio": 50000,
  "capacidadMaxima": 100,
  "inscritos": 0,
  "estado": "activa",
  "organizadorId": "uuid-del-organizador"
}
```

### 2. Obtener Todas las Conferencias
**GET** `/conferencias`

**Query Parameters (opcionales):**
- `estado`: Filtrar por estado (ej: `?estado=activa`)

**Ejemplo:** `GET /conferencias?estado=activa`

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "titulo": "Conferencia de TypeScript",
    "descripcion": "Aprende TypeScript desde cero",
    "fechaInicio": "2024-12-15T10:00:00.000Z",
    "fechaFin": "2024-12-15T18:00:00.000Z",
    "ubicacion": "Auditorio Principal",
    "precio": 50000,
    "capacidadMaxima": 100,
    "inscritos": 0,
    "estado": "activa",
    "organizador": { ... },
    "agendas": []
  }
]
```

### 3. Obtener Conferencias Disponibles (Endpoint Especializado)
**GET** `/conferencias/disponibles`

**Descripción:** Retorna solo las conferencias activas que tienen cupos disponibles.

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "titulo": "Conferencia de TypeScript",
    "inscritos": 50,
    "capacidadMaxima": 100,
    "estado": "activa",
    ...
  }
]
```

### 4. Obtener Conferencia por ID
**GET** `/conferencias/:id`

### 5. Inscribir Usuario a Conferencia (Endpoint Especializado)
**POST** `/conferencias/:id/inscribir`

**Descripción:** Incrementa el contador de inscritos. Valida que haya cupos disponibles y que la conferencia esté activa.

**Ejemplo:** `POST /conferencias/123e4567-e89b-12d3-a456-426614174000/inscribir`

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "titulo": "Conferencia de TypeScript",
  "inscritos": 1,
  "capacidadMaxima": 100,
  ...
}
```

**Errores posibles:**
- `400 Bad Request`: "La conferencia ha alcanzado su capacidad máxima"
- `400 Bad Request`: "Solo se pueden inscribir usuarios a conferencias activas"

### 6. Actualizar Conferencia
**PATCH** `/conferencias/:id`

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "precio": 45000,
  "estado": "completa",
  "inscritos": 50
}
```

### 7. Eliminar Conferencia
**DELETE** `/conferencias/:id`

---

## Endpoints - Agendas

### 1. Crear Agenda
**POST** `/agendas`

**Body (JSON):**
```json
{
  "fechaAgendada": "2024-12-15T14:00:00.000Z",
  "notas": "Recordar llevar laptop",
  "estado": "pendiente",
  "usuarioId": "uuid-del-usuario",
  "conferenciaId": "uuid-de-la-conferencia"
}
```

**Validaciones:**
- La fecha agendada debe estar dentro del rango de fechas de la conferencia
- El usuario y la conferencia deben existir

**Respuesta (201 Created):**
```json
{
  "id": "uuid-generado",
  "fechaAgendada": "2024-12-15T14:00:00.000Z",
  "notas": "Recordar llevar laptop",
  "estado": "pendiente",
  "fechaCreacion": "2024-01-15T10:00:00.000Z",
  "usuarioId": "uuid-del-usuario",
  "conferenciaId": "uuid-de-la-conferencia"
}
```

### 2. Obtener Todas las Agendas
**GET** `/agendas`

**Query Parameters (opcionales):**
- `usuarioId`: Filtrar por usuario (ej: `?usuarioId=uuid`)
- `conferenciaId`: Filtrar por conferencia (ej: `?conferenciaId=uuid`)
- `estado`: Filtrar por estado (ej: `?estado=pendiente`)

**Ejemplos:**
- `GET /agendas?usuarioId=123e4567-e89b-12d3-a456-426614174000`
- `GET /agendas?conferenciaId=123e4567-e89b-12d3-a456-426614174000`
- `GET /agendas?estado=confirmada`

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "fechaAgendada": "2024-12-15T14:00:00.000Z",
    "notas": "Recordar llevar laptop",
    "estado": "pendiente",
    "fechaCreacion": "2024-01-15T10:00:00.000Z",
    "usuario": { ... },
    "conferencia": { ... }
  }
]
```

### 3. Obtener Agenda por ID
**GET** `/agendas/:id`

### 4. Confirmar Agenda (Endpoint Especializado)
**POST** `/agendas/:id/confirmar`

**Descripción:** Cambia el estado de la agenda a "confirmada".

**Ejemplo:** `POST /agendas/123e4567-e89b-12d3-a456-426614174000/confirmar`

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "estado": "confirmada",
  ...
}
```

### 5. Actualizar Agenda
**PATCH** `/agendas/:id`

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "fechaAgendada": "2024-12-15T15:00:00.000Z",
  "notas": "Notas actualizadas",
  "estado": "confirmada"
}
```

**Validación:** Si se actualiza la fecha, debe estar dentro del rango de la conferencia.

### 6. Eliminar Agenda
**DELETE** `/agendas/:id`

---

## Ejemplos de Uso en Postman

### Colección de Postman

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "Conferencias API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Usuarios",
      "item": [
        {
          "name": "Crear Usuario",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombre\": \"Juan Pérez\",\n  \"correo\": \"juan@example.com\",\n  \"telefono\": \"1234567890\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/usuarios",
              "host": ["localhost"],
              "port": "3000",
              "path": ["usuarios"]
            }
          }
        },
        {
          "name": "Obtener Todos los Usuarios",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:3000/usuarios",
              "host": ["localhost"],
              "port": "3000",
              "path": ["usuarios"]
            }
          }
        }
      ]
    }
  ]
}
```

### Flujo Completo de Pruebas

1. **Crear un Usuario:**
   ```
   POST http://localhost:3000/usuarios
   Body: { "nombre": "Juan Pérez", "correo": "juan@example.com", "telefono": "1234567890", "password": "password123" }
   ```
   Guarda el `id` del usuario creado.

2. **Crear una Conferencia:**
   ```
   POST http://localhost:3000/conferencias
   Body: {
     "titulo": "Conferencia de TypeScript",
     "descripcion": "Aprende TypeScript",
     "fechaInicio": "2024-12-15T10:00:00.000Z",
     "fechaFin": "2024-12-15T18:00:00.000Z",
     "ubicacion": "Auditorio Principal",
     "precio": 50000,
     "capacidadMaxima": 100,
     "organizadorId": "<id-del-usuario-creado>"
   }
   ```
   Guarda el `id` de la conferencia creada.

3. **Obtener Conferencias Disponibles:**
   ```
   GET http://localhost:3000/conferencias/disponibles
   ```

4. **Inscribir Usuario a Conferencia:**
   ```
   POST http://localhost:3000/conferencias/<id-conferencia>/inscribir
   ```

5. **Crear una Agenda:**
   ```
   POST http://localhost:3000/agendas
   Body: {
     "fechaAgendada": "2024-12-15T14:00:00.000Z",
     "notas": "Recordar laptop",
     "usuarioId": "<id-del-usuario>",
     "conferenciaId": "<id-de-la-conferencia>"
   }
   ```
   Guarda el `id` de la agenda creada.

6. **Confirmar Agenda:**
   ```
   POST http://localhost:3000/agendas/<id-agenda>/confirmar
   ```

7. **Obtener Agendas por Usuario:**
   ```
   GET http://localhost:3000/agendas?usuarioId=<id-usuario>
   ```

## Validaciones

### Usuario
- `nombre`: String, requerido, máximo 100 caracteres
- `correo`: Email válido, requerido, máximo 100 caracteres, único
- `telefono`: String, requerido, máximo 20 caracteres
- `password`: String, requerido, mínimo 6 caracteres, máximo 255 caracteres

### Conferencia
- `titulo`: String, requerido, máximo 200 caracteres
- `descripcion`: String, requerido
- `fechaInicio`: Date, requerido
- `fechaFin`: Date, requerido, debe ser posterior a fechaInicio
- `ubicacion`: String, requerido, máximo 200 caracteres
- `precio`: Number, requerido, mínimo 0
- `capacidadMaxima`: Number, requerido, mínimo 1
- `organizadorId`: UUID, requerido

### Agenda
- `fechaAgendada`: Date, requerido, debe estar dentro del rango de la conferencia
- `notas`: String, opcional, máximo 200 caracteres
- `estado`: String, opcional, máximo 50 caracteres
- `usuarioId`: UUID, requerido
- `conferenciaId`: UUID, requerido

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Recurso eliminado exitosamente
- `400 Bad Request`: Error de validación o lógica de negocio
- `404 Not Found`: Recurso no encontrado

## Endpoints Especializados

### 1. Conferencias Disponibles
**GET** `/conferencias/disponibles`
- Retorna solo conferencias activas con cupos disponibles

### 2. Inscribir Usuario
**POST** `/conferencias/:id/inscribir`
- Incrementa el contador de inscritos
- Valida capacidad y estado

### 3. Confirmar Agenda
**POST** `/agendas/:id/confirmar`
- Cambia el estado de la agenda a "confirmada"

## Notas

- Todos los IDs son UUIDs (strings)
- Las fechas deben estar en formato ISO 8601
- La validación se realiza automáticamente usando `class-validator`
- Los errores de validación retornan detalles específicos del campo

---

## WebSockets y Webhooks

El sistema implementa un flujo de notificaciones en tiempo real usando WebSockets con un webhook como intermediario.

### Arquitectura

```
REST API → Webhook → WebSocket Gateway → Clientes WebSocket
```

**Características:**
- El REST no se comunica directamente con el WebSocket Gateway
- El webhook actúa como intermediario
- Las notificaciones se emiten globalmente (sin rooms)
- Cada notificación incluye: id, tipo de operación y datos relevantes

### Endpoints de Webhook

Los webhooks se invocan automáticamente cuando se realizan operaciones POST o PUT en las entidades.

#### POST /webhook/usuarios
**Descripción:** Webhook interno para notificaciones de usuarios

**Body (JSON):**
```json
{
  "id": "uuid-del-usuario",
  "tipoOperacion": "CREATE",
  "datos": {
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    ...
  }
}
```

#### POST /webhook/conferencias
**Descripción:** Webhook interno para notificaciones de conferencias

**Body (JSON):**
```json
{
  "id": "uuid-de-la-conferencia",
  "tipoOperacion": "UPDATE",
  "datos": {
    "titulo": "Conferencia de TypeScript",
    "precio": 50000,
    ...
  }
}
```

#### POST /webhook/agendas
**Descripción:** Webhook interno para notificaciones de agendas

**Body (JSON):**
```json
{
  "id": "uuid-de-la-agenda",
  "tipoOperacion": "CREATE",
  "datos": {
    "fechaAgendada": "2024-12-15T14:00:00.000Z",
    "estado": "pendiente",
    ...
  }
}
```

### WebSocket Gateway

**URL de Conexión:** `ws://localhost:3000`

**Eventos Emitidos:**

1. **Eventos Específicos por Entidad:**
   - `usuario:create` - Cuando se crea un usuario
   - `usuario:update` - Cuando se actualiza un usuario
   - `conferencia:create` - Cuando se crea una conferencia
   - `conferencia:update` - Cuando se actualiza una conferencia
   - `agenda:create` - Cuando se crea una agenda
   - `agenda:update` - Cuando se actualiza una agenda

2. **Evento Genérico:**
   - `notificacion` - Todas las notificaciones (incluye todas las entidades)

**Formato de Notificación:**
```json
{
  "id": "uuid-del-recurso",
  "tipoOperacion": "CREATE" | "UPDATE",
  "entidad": "usuario" | "conferencia" | "agenda",
  "datos": {
    // Datos del recurso con metadatos adicionales
    "_metadata": {
      "creado": true,
      "fechaCreacion": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Flujo Completo de Pruebas

#### 1. Conectar Cliente WebSocket en Thunder Client

**Configuración:**
- Tipo: WebSocket
- URL: `ws://localhost:3000`
- Eventos a escuchar:
  - `usuario:create`
  - `usuario:update`
  - `conferencia:create`
  - `conferencia:update`
  - `agenda:create`
  - `agenda:update`
  - `notificacion` (genérico)

**Pasos en Thunder Client:**
1. Abre Thunder Client
2. Ve a la pestaña "WebSocket"
3. Conecta a: `ws://localhost:3000`
4. Suscríbete a los eventos mencionados

#### 2. Crear un Usuario (POST)

**Request REST:**
```
POST http://localhost:3000/usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "1234567890",
  "password": "password123"
}
```

**Flujo:**
1. REST recibe la petición POST
2. UsuarioService crea el usuario
3. UsuarioService llama automáticamente al webhook: `POST /webhook/usuarios`
4. WebhookService procesa y enriquece los datos
5. WebSocketGateway emite eventos:
   - `usuario:create` con los datos del usuario
   - `notificacion` genérico
6. Cliente WebSocket recibe las notificaciones

**Respuesta del Webhook (si se llama directamente):**
```json
{
  "success": true,
  "message": "Webhook procesado correctamente"
}
```

**Notificación WebSocket recibida:**
```json
{
  "id": "uuid-generado",
  "tipoOperacion": "CREATE",
  "entidad": "usuario",
  "datos": {
    "id": "uuid-generado",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "1234567890",
    "fechaRegistro": "2024-01-15T10:00:00.000Z",
    "_metadata": {
      "creado": true,
      "fechaCreacion": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

#### 3. Actualizar una Conferencia (PATCH)

**Request REST:**
```
PATCH http://localhost:3000/conferencias/{id}
Content-Type: application/json

{
  "precio": 45000,
  "estado": "completa"
}
```

**Flujo:**
1. REST recibe la petición PATCH
2. ConferenciaService actualiza la conferencia
3. ConferenciaService llama automáticamente al webhook: `POST /webhook/conferencias`
4. WebhookService procesa y enriquece los datos
5. WebSocketGateway emite eventos:
   - `conferencia:update` con los datos actualizados
   - `notificacion` genérico
6. Cliente WebSocket recibe las notificaciones

**Notificación WebSocket recibida:**
```json
{
  "id": "uuid-de-la-conferencia",
  "tipoOperacion": "UPDATE",
  "entidad": "conferencia",
  "datos": {
    "id": "uuid-de-la-conferencia",
    "titulo": "Conferencia de TypeScript",
    "precio": 45000,
    "estado": "completa",
    "_metadata": {
      "actualizado": true,
      "fechaActualizacion": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

#### 4. Crear una Agenda (POST)

**Request REST:**
```
POST http://localhost:3000/agendas
Content-Type: application/json

{
  "fechaAgendada": "2024-12-15T14:00:00.000Z",
  "notas": "Recordar laptop",
  "usuarioId": "uuid-del-usuario",
  "conferenciaId": "uuid-de-la-conferencia"
}
```

**Flujo:**
1. REST recibe la petición POST
2. AgendaService crea la agenda
3. AgendaService llama automáticamente al webhook: `POST /webhook/agendas`
4. WebhookService procesa y enriquece los datos
5. WebSocketGateway emite eventos:
   - `agenda:create` con los datos de la agenda
   - `notificacion` genérico
6. Cliente WebSocket recibe las notificaciones

### Ejemplo Completo en Thunder Client

#### Paso 1: Conectar WebSocket
1. Abre Thunder Client
2. Ve a la pestaña "WebSocket"
3. URL: `ws://localhost:3000`
4. Click en "Connect"
5. Suscríbete a: `notificacion` (para recibir todas las notificaciones)

#### Paso 2: Realizar Operación REST
1. En otra pestaña de Thunder Client, ve a "REST"
2. Realiza un POST a `/usuarios` con los datos del usuario
3. Observa la respuesta del REST

#### Paso 3: Ver Notificación WebSocket
1. Vuelve a la pestaña WebSocket
2. Deberías ver la notificación en el evento `notificacion`
3. También deberías ver el evento específico `usuario:create`

### Estructura de Notificaciones

Todas las notificaciones incluyen:

- **id**: Identificador único del recurso (UUID)
- **tipoOperacion**: `CREATE` o `UPDATE`
- **entidad**: `usuario`, `conferencia` o `agenda`
- **datos**: Objeto con los datos del recurso y metadatos adicionales
- **timestamp**: Fecha y hora de la notificación

### Lógica Adicional en Webhook

El WebhookService aplica lógica adicional antes de emitir:

- Agrega metadatos `_metadata` con información de contexto
- Para CREATE: agrega `creado: true` y `fechaCreacion`
- Para UPDATE: agrega `actualizado: true` y `fechaActualizacion`

### Notas Importantes

- Los webhooks se llaman automáticamente después de POST y PUT
- Si el webhook falla, no interrumpe la operación REST (se registra el error)
- Las notificaciones son globales (todos los clientes conectados las reciben)
- No se usan rooms o canales específicos
- El WebSocket Gateway está disponible en el mismo puerto que el REST (3000)

---

## Guía Completa: WebSockets y Pruebas con Postman

### ¿Qué son los WebSockets?

Los WebSockets son un protocolo de comunicación que permite una conexión bidireccional y persistente entre un cliente (navegador, aplicación) y un servidor. A diferencia de HTTP (que es request-response), los WebSockets mantienen la conexión abierta, permitiendo que el servidor envíe datos al cliente en cualquier momento sin que el cliente tenga que solicitarlos.

**Ventajas:**
- Comunicación en tiempo real
- Menor latencia que HTTP polling
- Conexión persistente
- Bidireccional (cliente ↔ servidor)

### Arquitectura del Sistema

En este proyecto, el flujo es:

```
1. Cliente REST → POST/PUT a /usuarios, /conferencias, /agendas
2. Servicio REST → Guarda en BD y llama al Webhook (HTTP interno)
3. Webhook → Procesa datos y notifica al WebSocket Gateway
4. WebSocket Gateway → Emite evento a todos los clientes conectados
5. Clientes WebSocket → Reciben notificación en tiempo real
```

**Puntos clave:**
- El REST **NO** se comunica directamente con el WebSocket
- El Webhook actúa como **intermediario**
- Las notificaciones son **globales** (sin rooms)

### Paso 1: Iniciar el Servidor

```bash
cd rest
npm run start:dev
```

Deberías ver:
```
[Nest] ... Application is running on: http://localhost:3000
WebSocket disponible en ws://localhost:3000
```

### Paso 2: Conectar WebSocket en Postman

#### 2.1. Abrir Postman y Crear Nueva Conexión WebSocket

1. Abre Postman
2. Click en **"New"** (botón superior izquierdo)
3. Selecciona **"WebSocket Request"**
4. En la URL, escribe: `ws://localhost:3000`
5. Click en **"Connect"**

#### 2.2. Verificar Conexión

Después de conectar, deberías ver:
- Estado: **Connected** (en verde)
- Mensajes en la consola del servidor:
  ```
  [WebSocketGateway] Cliente conectado: <socket-id>
  ```

#### 2.3. Suscribirse a Eventos

En Postman, en la sección **"Messages"**, puedes escribir el nombre del evento que quieres escuchar. Sin embargo, con Socket.IO, los eventos se reciben automáticamente cuando el servidor los emite.

**Eventos disponibles:**
- `usuario:create` - Cuando se crea un usuario
- `usuario:update` - Cuando se actualiza un usuario
- `conferencia:create` - Cuando se crea una conferencia
- `conferencia:update` - Cuando se actualiza una conferencia
- `agenda:create` - Cuando se crea una agenda
- `agenda:update` - Cuando se actualiza una agenda
- `notificacion` - Evento genérico (recibe todas las notificaciones)

**Nota:** Con Socket.IO, no necesitas "suscribirte" explícitamente. Simplemente mantén la conexión abierta y recibirás todos los eventos que el servidor emita.

### Paso 3: Realizar Operación REST (POST)

#### 3.1. Crear Nueva Request REST en Postman

1. En otra pestaña de Postman, crea una nueva **HTTP Request**
2. Método: **POST**
3. URL: `http://localhost:3000/usuarios`
4. Headers:
   - `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "nombre": "María García",
  "correo": "maria@example.com",
  "telefono": "0987654321",
  "password": "password456"
}
```

#### 3.2. Enviar la Petición

1. Click en **"Send"**
2. Deberías recibir una respuesta 201 con el usuario creado:
```json
{
  "id": "uuid-generado",
  "nombre": "María García",
  "correo": "maria@example.com",
  "telefono": "0987654321",
  "fechaRegistro": "2024-01-15T10:00:00.000Z"
}
```

### Paso 4: Ver la Notificación WebSocket

#### 4.1. Volver a la Pestaña WebSocket

1. Vuelve a la pestaña del WebSocket en Postman
2. En la sección de mensajes, deberías ver la notificación recibida

#### 4.2. Formato de la Notificación

Deberías recibir dos eventos:

**Evento 1: `usuario:create`**
```json
{
  "id": "uuid-del-usuario",
  "tipoOperacion": "CREATE",
  "entidad": "usuario",
  "datos": {
    "id": "uuid-del-usuario",
    "nombre": "María García",
    "correo": "maria@example.com",
    "telefono": "0987654321",
    "password": "password456",
    "fechaRegistro": "2024-01-15T10:00:00.000Z",
    "_metadata": {
      "creado": true,
      "fechaCreacion": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Evento 2: `notificacion` (genérico)**
```json
{
  "id": "uuid-del-usuario",
  "tipoOperacion": "CREATE",
  "entidad": "usuario",
  "datos": { ... },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Paso 5: Probar Actualización (PUT/PATCH)

#### 5.1. Actualizar Usuario

1. En la pestaña REST de Postman
2. Método: **PATCH**
3. URL: `http://localhost:3000/usuarios/{id-del-usuario-creado}`
4. Body:
```json
{
  "telefono": "1111111111"
}
```

#### 5.2. Ver Notificación de Actualización

1. Vuelve a la pestaña WebSocket
2. Deberías recibir:
   - Evento: `usuario:update`
   - Evento: `notificacion`

**Formato:**
```json
{
  "id": "uuid-del-usuario",
  "tipoOperacion": "UPDATE",
  "entidad": "usuario",
  "datos": {
    "id": "uuid-del-usuario",
    "nombre": "María García",
    "correo": "maria@example.com",
    "telefono": "1111111111",
    "_metadata": {
      "actualizado": true,
      "fechaActualizacion": "2024-01-15T10:05:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:05:00.000Z"
}
```

### Paso 6: Probar con Otras Entidades

#### 6.1. Crear Conferencia

**REST Request:**
```
POST http://localhost:3000/conferencias
Content-Type: application/json

{
  "titulo": "Workshop de Node.js",
  "descripcion": "Aprende Node.js desde cero",
  "fechaInicio": "2024-12-20T09:00:00.000Z",
  "fechaFin": "2024-12-20T17:00:00.000Z",
  "ubicacion": "Sala B",
  "precio": 35000,
  "capacidadMaxima": 50,
  "organizadorId": "uuid-del-usuario"
}
```

**Eventos WebSocket recibidos:**
- `conferencia:create`
- `notificacion`

#### 6.2. Crear Agenda

**REST Request:**
```
POST http://localhost:3000/agendas
Content-Type: application/json

{
  "fechaAgendada": "2024-12-20T14:00:00.000Z",
  "notas": "Llevar laptop",
  "usuarioId": "uuid-del-usuario",
  "conferenciaId": "uuid-de-la-conferencia"
}
```

**Eventos WebSocket recibidos:**
- `agenda:create`
- `notificacion`

### Paso 7: Flujo Completo de Demostración

Para demostrar el flujo completo:

1. **Conectar WebSocket** en Postman a `ws://localhost:3000`
2. **Crear Usuario** (POST `/usuarios`)
   - Ver respuesta REST
   - Ver notificación WebSocket `usuario:create`
3. **Actualizar Usuario** (PATCH `/usuarios/{id}`)
   - Ver respuesta REST
   - Ver notificación WebSocket `usuario:update`
4. **Crear Conferencia** (POST `/conferencias`)
   - Ver respuesta REST
   - Ver notificación WebSocket `conferencia:create`
5. **Crear Agenda** (POST `/agendas`)
   - Ver respuesta REST
   - Ver notificación WebSocket `agenda:create`

### Solución de Problemas

#### Problema: No recibo notificaciones WebSocket

**Solución:**
1. Verifica que el servidor esté corriendo
2. Verifica que la conexión WebSocket esté activa (debe decir "Connected")
3. Revisa la consola del servidor para ver si hay errores
4. Asegúrate de usar `ws://` y no `http://` en la URL del WebSocket

#### Problema: Error de conexión WebSocket

**Solución:**
1. Verifica que el servidor esté en el puerto 3000
2. Verifica que no haya un firewall bloqueando
3. Intenta reiniciar el servidor

#### Problema: Los eventos no se reciben

**Solución:**
1. Verifica en la consola del servidor que el webhook se esté llamando
2. Revisa los logs: deberías ver "Webhook llamado para..." y "Emitiendo evento:..."
3. Asegúrate de que la operación REST fue exitosa (código 201 o 200)

### Verificación en la Consola del Servidor

Cuando todo funciona correctamente, deberías ver en la consola:

```
[UsuarioService] Webhook llamado para usuario <id> - CREATE
[WebhookService] Procesando webhook: CREATE en usuario con ID <id>
[WebhookService] Notificación emitida: usuario:create
[WebSocketGateway] Emitiendo evento: usuario:create
```

### Resumen del Flujo

```
┌─────────────┐
│   Cliente   │
│   REST      │──POST/PUT──>┌──────────────┐
└─────────────┘             │   Servicio   │
                             │   REST       │
                             └──────┬───────┘
                                    │
                                    │ HTTP interno
                                    ▼
                             ┌──────────────┐
                             │   Webhook    │
                             │   Service    │
                             └──────┬───────┘
                                    │
                                    │ Método directo
                                    ▼
                             ┌──────────────┐
                             │  WebSocket   │
                             │   Gateway    │
                             └──────┬───────┘
                                    │
                                    │ Emit global
                                    ▼
                             ┌──────────────┐
                             │   Cliente    │
                             │  WebSocket   │
                             │  (Postman)   │
                             └──────────────┘
```

### Comandos Útiles

```bash
# Iniciar servidor en desarrollo
npm run start:dev

# Compilar proyecto
npm run build

# Ver logs en tiempo real
# (Los logs aparecen automáticamente en la consola)
```

### Ejemplo de Sesión Completa

1. **Iniciar servidor:** `npm run start:dev`
2. **Abrir Postman:** Crear conexión WebSocket a `ws://localhost:3000`
3. **Crear usuario:**
   - REST: `POST http://localhost:3000/usuarios`
   - Body: `{"nombre": "Juan", "correo": "juan@test.com", "telefono": "123", "password": "pass123"}`
   - Respuesta: Usuario creado con ID
   - WebSocket: Recibe `usuario:create` y `notificacion`
4. **Actualizar usuario:**
   - REST: `PATCH http://localhost:3000/usuarios/{id}`
   - Body: `{"telefono": "999"}`
   - Respuesta: Usuario actualizado
   - WebSocket: Recibe `usuario:update` y `notificacion`

¡Listo! Ahora tienes una guía completa para probar WebSockets con Postman.

