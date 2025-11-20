# CUESTIONARIO COMPLETO: NestJS (TypeORM, REST, WebSocket, GraphQL)

Basado en documentación oficial: https://docs.nestjs.com/

---

## SECCIÓN 1: FUNDAMENTOS DE NESTJS

### 1.1 Conceptos Generales

**P1.1.1** ¿Cuáles son los dos patrones de programación principales que combina NestJS?
<details>
<summary>Respuesta</summary>
OOP (Object Oriented Programming) y FP (Functional Programming), junto con FRP (Functional Reactive Programming).
</details>

**P1.1.2** ¿Cuáles son los servidores HTTP por defecto que puede usar NestJS?
<details>
<summary>Respuesta</summary>
Express (por defecto) y Fastify (como opción alternativa).
</details>

**P1.1.3** ¿Cuál es la unidad básica de una aplicación NestJS?
<details>
<summary>Respuesta</summary>
El módulo (`@Module`). Cada aplicación tiene al menos un módulo raíz (AppModule).
</details>

### 1.2 Inyección de Dependencias

**P1.2.1** ¿Qué es un "provider" en NestJS?
<details>
<summary>Respuesta</summary>
Un proveedor es una clase que puede ser inyectada en otras clases usando el constructor. Los servicios, repositorios y utilidades son proveedores.
</details>

**P1.2.2** ¿Cómo se registra un proveedor en un módulo?
<details>
<summary>Respuesta</summary>
Se añade en el array `providers` del decorador `@Module()`:
```typescript
@Module({
  providers: [MiServicio]
})
export class MiModulo {}
```
</details>

**P1.2.3** ¿Cuál es la diferencia entre inyección por constructor y inyección por propiedad?
<details>
<summary>Respuesta</summary>
NestJS recomienda inyección por constructor, ya que permite que el framework gestione las dependencias automáticamente y facilita las pruebas unitarias.
```typescript
constructor(private miServicio: MiServicio) {}
```
</details>

---

## SECCIÓN 2: REST API CON NESTJS

### 2.1 Controladores

**P2.1.1** ¿Qué decorador define un controlador y qué parámetro toma?
<details>
<summary>Respuesta</summary>
`@Controller()` define un controlador. Toma como parámetro un prefijo de ruta (opcional):
```typescript
@Controller('usuarios')
export class UsuariosController {}
```
</details>

**P2.1.2** Enumera los decoradores HTTP disponibles en NestJS.
<details>
<summary>Respuesta</summary>
- `@Get()` - GET requests
- `@Post()` - POST requests
- `@Put()` - PUT requests (reemplazo completo)
- `@Patch()` - PATCH requests (actualización parcial)
- `@Delete()` - DELETE requests
- `@Head()` - HEAD requests
- `@Options()` - OPTIONS requests
- `@All()` - Todos los métodos HTTP
</details>

**P2.1.3** ¿Cuál es la diferencia entre `@Put()` y `@Patch()`?
<details>
<summary>Respuesta</summary>
- `@Put()`: Reemplaza completamente un recurso
- `@Patch()`: Actualiza parcialmente un recurso (solo los campos proporcionados)
</details>

**P2.1.4** ¿Cuál es el código status HTTP por defecto para POST?
<details>
<summary>Respuesta</summary>
201 (Created). Para otros métodos es 200 (OK).
</details>

### 2.2 Decoradores de Parámetros

**P2.2.1** ¿Cuáles son los decoradores de parámetros disponibles en controladores?
<details>
<summary>Respuesta</summary>
- `@Request()`, `@Req()` - request object
- `@Response()`, `@Res()` - response object
- `@Next()` - next middleware
- `@Session()` - session object
- `@Param(key?)` - parámetros de ruta
- `@Body(key?)` - body de la solicitud
- `@Query(key?)` - query string parameters
- `@Headers(name?)` - headers
- `@Ip()` - IP del cliente
- `@HostParam()` - host parameters
</details>

**P2.2.2** ¿Cómo acceder a un parámetro de ruta?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Param()`:
```typescript
@Get(':id')
obtener(@Param('id') id: string) {
  return `Usuario: ${id}`;
}
```
</details>

**P2.2.3** ¿Cómo acceder a los query parameters?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Query()`:
```typescript
@Get()
listar(@Query('edad') edad: number, @Query('rol') rol: string) {
  return `Edad: ${edad}, Rol: ${rol}`;
}
```
</details>

**P2.2.4** ¿Cómo extraer el body completo de una solicitud POST?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Body()`:
```typescript
@Post()
crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
  return crearUsuarioDto;
}
```
</details>

### 2.3 DTOs (Data Transfer Objects)

**P2.3.1** ¿Qué es un DTO y por qué se recomienda usarlos?
<details>
<summary>Respuesta</summary>
Un DTO (Data Transfer Object) define cómo los datos deben ser enviados sobre la red. Se recomienda usar clases (no interfaces) porque NestJS puede referenciarlas en tiempo de ejecución.
</details>

**P2.3.2** ¿Por qué se recomienda usar clases en lugar de interfaces para DTOs?
<details>
<summary>Respuesta</summary>
Las clases son parte del ES6 y permanecen en el código compilado de JavaScript. Las interfaces de TypeScript se elimina durante la transpilación, lo que impide que NestJS las referencie en tiempo de ejecución.
</details>

**P2.3.3** Escribe un DTO simple para un usuario.
<details>
<summary>Respuesta</summary>
```typescript
export class CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
  rol: string;
}
```
</details>

### 2.4 Respuestas HTTP

**P2.4.1** ¿Cómo cambiar el código de status HTTP de una respuesta?
<details>
<summary>Respuesta</summary>
Usando el decorador `@HttpCode()`:
```typescript
@Post()
@HttpCode(204)
crear() {
  return 'Usuario creado';
}
```
</details>

**P2.4.2** ¿Cómo agregar headers personalizados a una respuesta?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Header()`:
```typescript
@Post()
@Header('Cache-Control', 'no-store')
crear() {
  return 'Usuario creado';
}
```
</details>

**P2.4.3** ¿Cómo redirigir a otra URL?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Redirect()`:
```typescript
@Get('/redirect')
@Redirect('https://nestjs.com', 301)
redirigir() {}
```
</details>

**P2.4.4** ¿Cuál es la diferencia entre el enfoque "Standard" y "Library-specific" para manejar respuestas?
<details>
<summary>Respuesta</summary>
- **Standard**: Retorna directamente el valor y NestJS maneja la serialización automáticamente
- **Library-specific**: Inyecta el objeto response de Express/Fastify directamente. Requiere manejar manualmente la respuesta.

```typescript
// Standard
@Get()
obtener() {
  return { nombre: 'Juan' };
}

// Library-specific
@Get()
obtener(@Res() res: Response) {
  res.status(200).json({ nombre: 'Juan' });
}
```
</details>

### 2.5 Operaciones Asincrónicas

**P2.5.1** ¿Qué patrones soporta NestJS para operaciones asincrónicas?
<details>
<summary>Respuesta</summary>
- Funciones `async/await` que retornan Promises
- Observables de RxJS
- NestJS se encarga automáticamente de resolver ambos
</details>

**P2.5.2** Escribe un controlador con una operación asincrónica.
<details>
<summary>Respuesta</summary>
```typescript
@Get()
async obtenerTodos(): Promise<Usuario[]> {
  return await this.usuariosService.obtenerTodos();
}
```
</details>

---

## SECCIÓN 3: TYPEORM (Base de Datos)

### 3.1 Configuración y Conexión

**P3.1.1** ¿Cuál es el padrón de diseño que implementa TypeORM?
<details>
<summary>Respuesta</summary>
El padrón Repository. Cada entidad tiene su propio repositorio que encapsula la lógica de acceso a datos.
</details>

**P3.1.2** ¿Cómo se configura TypeORM en una aplicación NestJS?
<details>
<summary>Respuesta</summary>
Importando `TypeOrmModule.forRoot()` en el módulo raíz:
```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```
</details>

**P3.1.3** ¿Qué significa la opción `synchronize: true` y por qué no debe usarse en producción?
<details>
<summary>Respuesta</summary>
Sincroniza automáticamente el esquema de la base de datos con las entidades. No debe usarse en producción porque puede causar pérdida de datos.
</details>

**P3.1.4** ¿Cuál es el propósito de `autoLoadEntities`?
<details>
<summary>Respuesta</summary>
Si se establece en `true`, carga automáticamente todas las entidades registradas en módulos sin necesidad de especificarlas manualmente en el array `entities`.
</details>

### 3.2 Entidades

**P3.2.1** ¿Cómo se define una entidad TypeORM en NestJS?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Entity()` en una clase:
```typescript
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column({ default: true })
  activo: boolean;
}
```
</details>

**P3.2.2** ¿Cuáles son los decoradores principales para definir columnas?
<details>
<summary>Respuesta</summary>
- `@Column()` - Columna básica
- `@PrimaryGeneratedColumn()` - ID autogenerado
- `@Column({ type: 'varchar', length: 100 })` - Especificar tipo y tamaño
- `@Column({ default: true })` - Valor por defecto
- `@Column({ nullable: true })` - Permitir NULL
- `@Column({ unique: true })` - Restricción única
</details>

**P3.2.3** ¿Cuál es la diferencia entre `@PrimaryGeneratedColumn()` y `@PrimaryColumn()`?
<details>
<summary>Respuesta</summary>
- `@PrimaryGeneratedColumn()`: El ID se genera automáticamente (auto-increment)
- `@PrimaryColumn()`: El ID se proporciona manualmente
</details>

**P3.2.4** ¿Cómo se define una relación one-to-many entre entidades?
<details>
<summary>Respuesta</summary>
Usando el decorador `@OneToMany()`:
```typescript
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Foto, foto => foto.usuario)
  fotos: Foto[];
}
```
</details>

**P3.2.5** ¿Cuáles son los tres tipos de relaciones en TypeORM?
<details>
<summary>Respuesta</summary>
1. **One-to-one**: Una fila en la tabla primaria se relaciona con una en la tabla foránea (`@OneToOne()`)
2. **One-to-many / Many-to-one**: Una fila en la tabla primaria se relaciona con múltiples en la foránea (`@OneToMany()`, `@ManyToOne()`)
3. **Many-to-many**: Relación múltiple en ambas direcciones (`@ManyToMany()`)
</details>

### 3.3 Repositorio

**P3.3.1** ¿Cómo se inyecta un repositorio en un servicio?
<details>
<summary>Respuesta</summary>
Usando el decorador `@InjectRepository()`:
```typescript
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}
}
```
</details>

**P3.3.2** Enumera los métodos CRUD principales del repositorio TypeORM.
<details>
<summary>Respuesta</summary>
- `find()` - Obtener todos los registros
- `findOne()` - Obtener un registro por condiciones
- `findOneBy({ id: 1 })` - Obtener por un campo específico
- `save(entidad)` - Crear o actualizar
- `delete(id)` - Eliminar por ID
- `update(id, datos)` - Actualizar sin cargar la entidad
- `remove(entidad)` - Eliminar una entidad
- `findAndCount()` - Obtener registros y cantidad total
</details>

**P3.3.3** ¿Cuál es la diferencia entre `delete()` y `remove()`?
<details>
<summary>Respuesta</summary>
- `delete(id)`: Ejecuta una operación DELETE SQL directamente (más eficiente)
- `remove(entidad)`: Carga la entidad primero, ejecuta hooks de ciclo de vida, y luego la elimina
</details>

**P3.3.4** Escribe un servicio TypeORM completo con métodos CRUD.
<details>
<summary>Respuesta</summary>
```typescript
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  crear(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    const usuario = this.usuariosRepository.create(crearUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  obtenerTodos(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  obtenerPorId(id: number): Promise<Usuario> {
    return this.usuariosRepository.findOneBy({ id });
  }

  async actualizar(id: number, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<Usuario> {
    await this.usuariosRepository.update(id, actualizarUsuarioDto);
    return this.obtenerPorId(id);
  }

  async eliminar(id: number): Promise<void> {
    await this.usuariosRepository.delete(id);
  }
}
```
</details>

### 3.4 Transacciones

**P3.4.1** ¿Cómo se manejan las transacciones en TypeORM con NestJS?
<details>
<summary>Respuesta</summary>
Usando `QueryRunner` desde la `DataSource`:
```typescript
@Injectable()
export class TransaccionService {
  constructor(private dataSource: DataSource) {}

  async crearMultiples(usuarios: Usuario[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(usuarios[0]);
      await queryRunner.manager.save(usuarios[1]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
```
</details>

**P3.4.2** ¿Cuál es la alternativa más simple para manejar transacciones?
<details>
<summary>Respuesta</summary>
Usar el método `transaction()` de la `DataSource`:
```typescript
async crearMultiples(usuarios: Usuario[]) {
  await this.dataSource.transaction(async manager => {
    await manager.save(usuarios[0]);
    await manager.save(usuarios[1]);
  });
}
```
</details>

### 3.5 Opciones Avanzadas

**P3.5.1** ¿Qué es `autoLoadEntities` y cuándo es útil?
<details>
<summary>Respuesta</summary>
Cuando se establece en `true`, carga automáticamente todas las entidades registradas mediante `TypeOrmModule.forFeature()` sin necesidad de especificarlas en el array `entities` de la configuración.
</details>

**P3.5.2** ¿Cómo se configuran múltiples bases de datos?
<details>
<summary>Respuesta</summary>
Se llama a `TypeOrmModule.forRoot()` múltiples veces con un `name` diferente para cada conexión:
```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      // configuración...
    }),
    TypeOrmModule.forRoot({
      name: 'secondary',
      type: 'mysql',
      // configuración alternativa...
    }),
  ],
})
export class AppModule {}
```
</details>

**P3.5.3** ¿Cómo se inyecta un repositorio de una conexión específica?
<details>
<summary>Respuesta</summary>
Usando el decorador `@InjectRepository()` con el nombre de la conexión:
```typescript
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario, 'secondary')
    private usuariosRepository: Repository<Usuario>,
  ) {}
}
```
</details>

---

## SECCIÓN 4: WEBSOCKETS

### 4.1 Conceptos Fundamentales

**P4.1.1** ¿Qué es un gateway en NestJS?
<details>
<summary>Respuesta</summary>
Un gateway es una clase decorada con `@WebSocketGateway()` que maneja la comunicación WebSocket. Es similar a un controlador pero para conexiones bidireccionales.
</details>

**P4.1.2** ¿Cuáles son las librerías WebSocket soportadas por NestJS?
<details>
<summary>Respuesta</summary>
- **Socket.IO** (por defecto)
- **ws** (librería WebSocket nativa)

Se pueden crear adaptadores personalizados para otros.
</details>

**P4.1.3** ¿Cuál es la diferencia entre un controlador y un gateway?
<details>
<summary>Respuesta</summary>
- **Controlador**: Maneja solicitudes HTTP síncronas y devuelve respuestas
- **Gateway**: Maneja conexiones WebSocket bidireccionales persistentes
</details>

### 4.2 Gateways

**P4.2.1** ¿Cómo se define un gateway en NestJS?
<details>
<summary>Respuesta</summary>
Usando el decorador `@WebSocketGateway()`:
```typescript
@WebSocketGateway(80, { namespace: 'events' })
export class EventsGateway {}
```
</details>

**P4.2.2** ¿Qué parámetros toma el decorador `@WebSocketGateway()`?
<details>
<summary>Respuesta</summary>
- Primer parámetro: Puerto (opcional, por defecto usa el mismo del servidor HTTP)
- Segundo parámetro: Opciones como `namespace`, `transports`, etc.

```typescript
@WebSocketGateway(81, { 
  namespace: 'chat',
  transports: ['websocket'] 
})
```
</details>

**P4.2.3** ¿Qué es un namespace en WebSocket?
<details>
<summary>Respuesta</summary>
Un namespace es un canal independiente dentro de una conexión WebSocket. Permite separar diferentes tipos de comunicación. Por ejemplo, `/events` y `/chat` serían dos namespaces diferentes.
</details>

### 4.3 Manejo de Mensajes

**P4.3.1** ¿Cómo suscribirse a un mensaje en un gateway?
<details>
<summary>Respuesta</summary>
Usando el decorador `@SubscribeMessage()`:
```typescript
@SubscribeMessage('eventos')
handleEvent(@MessageBody() data: string): string {
  return data;
}
```
</details>

**P4.3.2** ¿Cuál es la diferencia entre `@MessageBody()` y `@ConnectedSocket()`?
<details>
<summary>Respuesta</summary>
- `@MessageBody()`: Extrae los datos del mensaje enviado por el cliente
- `@ConnectedSocket()`: Proporciona acceso al objeto socket del cliente conectado

```typescript
@SubscribeMessage('evento')
handleEvent(
  @MessageBody() data: string,
  @ConnectedSocket() socket: Socket,
) {}
```
</details>

**P4.3.3** ¿Cómo responder múltiples veces a un solo mensaje?
<details>
<summary>Respuesta</summary>
Retornando un objeto con propiedades `event` y `data`:
```typescript
@SubscribeMessage('evento')
handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
  return { event: 'evento', data };
}
```
</details>

**P4.3.4** ¿Cómo emitir un mensaje a través del gateway?
<details>
<summary>Respuesta</summary>
Usando el decorador `@WebSocketServer()` y los métodos de Socket.IO:
```typescript
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitirACliente(clientId: string, evento: string, datos: any) {
    this.server.to(clientId).emit(evento, datos);
  }

  emitirATodos(evento: string, datos: any) {
    this.server.emit(evento, datos);
  }
}
```
</details>

### 4.4 Rooms (Salas)

**P4.4.1** ¿Qué son las rooms (salas) en WebSocket?
<details>
<summary>Respuesta</summary>
Las rooms son grupos de clientes conectados. Permiten enviar mensajes a un subconjunto de clientes conectados sin afectar a todos.
</details>

**P4.4.2** ¿Cómo unir un cliente a una room?
<details>
<summary>Respuesta</summary>
Usando el método `join()` del socket:
```typescript
@SubscribeMessage('unirse')
handleUnirse(
  @ConnectedSocket() socket: Socket,
  @MessageBody() room: string,
) {
  socket.join(room);
}
```
</details>

**P4.4.3** ¿Cómo enviar un mensaje a una room específica?
<details>
<summary>Respuesta</summary>
Usando el método `to()` del servidor:
```typescript
@WebSocketServer()
server: Server;

emitirARoom(room: string, evento: string, datos: any) {
  this.server.to(room).emit(evento, datos);
}
```
</details>

**P4.4.4** ¿Cómo remover un cliente de una room?
<details>
<summary>Respuesta</summary>
Usando el método `leave()` del socket:
```typescript
@SubscribeMessage('salir')
handleSalir(
  @ConnectedSocket() socket: Socket,
  @MessageBody() room: string,
) {
  socket.leave(room);
}
```
</details>

### 4.5 Ciclo de Vida

**P4.5.1** ¿Cuáles son los lifecycle hooks disponibles en gateways?
<details>
<summary>Respuesta</summary>
- `OnGatewayInit`: Se ejecuta cuando se inicializa el gateway (`afterInit()`)
- `OnGatewayConnection`: Se ejecuta cuando un cliente se conecta (`handleConnection()`)
- `OnGatewayDisconnect`: Se ejecuta cuando un cliente se desconecta (`handleDisconnect()`)
</details>

**P4.5.2** Escribe un gateway completo con ciclo de vida.
<details>
<summary>Respuesta</summary>
```typescript
@WebSocketGateway()
export class EventsGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Gateway inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('mensaje')
  handleMensaje(
    @ConnectedSocket() socket: Socket,
    @MessageBody() datos: string,
  ) {
    this.server.emit('respuesta', datos);
  }
}
```
</details>

### 4.6 Respuestas Asincrónicas

**P4.6.1** ¿Cómo manejar operaciones asincrónicas en un gateway?
<details>
<summary>Respuesta</summary>
Los handlers pueden ser `async` y retornar Promises o Observables:
```typescript
@SubscribeMessage('evento')
async handleEvento(@MessageBody() data: unknown): Promise<WsResponse<unknown>> {
  await delay(1000);
  return { event: 'evento', data };
}
```
</details>

**P4.6.2** ¿Cómo retornar múltiples valores usando Observable?
<details>
<summary>Respuesta</summary>
```typescript
@SubscribeMessage('eventos')
onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  return from([1, 2, 3]).pipe(
    map(item => ({ event: 'eventos', data: item })),
  );
}
```
</details>

---

## SECCIÓN 5: GRAPHQL

### 5.1 Configuración

**P5.1.1** ¿Cuáles son las dos formas de construir una API GraphQL en NestJS?
<details>
<summary>Respuesta</summary>
1. **Code First**: Define la estructura usando TypeScript y decoradores, y GraphQL genera el esquema automáticamente
2. **Schema First**: Define el esquema GraphQL primero (SDL) y NestJS genera las clases TypeScript
</details>

**P5.1.2** ¿Cómo se configura GraphQL en una aplicación NestJS?
<details>
<summary>Respuesta</summary>
Importando `GraphQLModule` con `forRoot()`:
```typescript
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
```
</details>

**P5.1.3** ¿Qué significa `autoSchemaFile`?
<details>
<summary>Respuesta</summary>
Genera automáticamente el archivo de esquema GraphQL basado en los decoradores de las clases. Si se establece en `true`, se genera en memoria.
</details>

**P5.1.4** ¿Cómo habilitar GraphiQL (IDE de GraphQL)?
<details>
<summary>Respuesta</summary>
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  graphiql: true,  // Habilita GraphiQL
})
```
</details>

### 5.2 Queries

**P5.2.1** ¿Qué es una Query en GraphQL?
<details>
<summary>Respuesta</summary>
Una Query es una operación de lectura (GET) que solicita datos del servidor. Es similar a GET en REST.
</details>

**P5.2.2** ¿Cómo se define un Query en NestJS (Code First)?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Query()`:
```typescript
@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private usuariosService: UsuariosService) {}

  @Query(() => Usuario)
  usuario(@Args('id') id: number): Promise<Usuario> {
    return this.usuariosService.obtenerPorId(id);
  }

  @Query(() => [Usuario])
  usuarios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerTodos();
  }
}
```
</details>

**P5.2.3** ¿Cuál es la diferencia entre `@Query()` y `@ResolveField()`?
<details>
<summary>Respuesta</summary>
- `@Query()`: Define un campo raíz en el tipo Query (entrada a la API)
- `@ResolveField()`: Resuelve un campo específico de un tipo (suele usarse para relaciones)
</details>

### 5.3 Mutations

**P5.3.1** ¿Qué es una Mutation en GraphQL?
<details>
<summary>Respuesta</summary>
Una Mutation es una operación de escritura (POST, PUT, DELETE) que modifica datos en el servidor. Es similar a POST/PUT/DELETE en REST.
</details>

**P5.3.2** ¿Cómo se define una Mutation en NestJS?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Mutation()`:
```typescript
@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private usuariosService: UsuariosService) {}

  @Mutation(() => Usuario)
  crearUsuario(
    @Args('nombre') nombre: string,
    @Args('email') email: string,
  ): Promise<Usuario> {
    return this.usuariosService.crear({ nombre, email });
  }

  @Mutation(() => Usuario)
  actualizarUsuario(
    @Args('id') id: number,
    @Args('nombre') nombre: string,
  ): Promise<Usuario> {
    return this.usuariosService.actualizar(id, { nombre });
  }

  @Mutation(() => Boolean)
  eliminarUsuario(@Args('id') id: number): Promise<void> {
    return this.usuariosService.eliminar(id);
  }
}
```
</details>

**P5.3.3** ¿Qué es un Input Type en GraphQL?
<details>
<summary>Respuesta</summary>
Un Input Type es un tipo especial que se usa para pasar objetos complejos como argumentos en Mutations y Queries. Se define con `@InputType()`:
```typescript
@InputType()
export class CrearUsuarioInput {
  @Field()
  nombre: string;

  @Field()
  email: string;

  @Field()
  edad: number;
}

@Mutation(() => Usuario)
crearUsuario(@Args('input') input: CrearUsuarioInput): Promise<Usuario> {
  return this.usuariosService.crear(input);
}
```
</details>

### 5.4 Tipos de Datos

**P5.4.1** ¿Cuáles son los scalar types por defecto en GraphQL (Code First)?
<details>
<summary>Respuesta</summary>
- `Int` - Enteros de 32 bits
- `Float` - Números flotantes de precisión doble
- `String` - Cadenas de texto
- `Boolean` - Verdadero/Falso
- `ID` - Identificador único
- `GraphQLISODateTime` - Fecha/hora en formato ISO (por defecto para Date)
- `GraphQLTimestamp` - Timestamp Unix
</details>

**P5.4.2** ¿Cómo se define un campo con tipo en GraphQL (Code First)?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Field()`:
```typescript
@ObjectType()
export class Usuario {
  @Field()
  id: number;

  @Field()
  nombre: string;

  @Field()
  email: string;

  @Field()
  edad: number;

  @Field({ nullable: true })
  descripcion: string;

  @Field(() => [Artículo])
  artículos: Artículo[];
}
```
</details>

**P5.4.3** ¿Cómo hacer un campo opcional en GraphQL?
<details>
<summary>Respuesta</summary>
Usando la opción `nullable: true` en `@Field()`:
```typescript
@Field({ nullable: true })
descripcion: string;
```
</details>

**P5.4.4** ¿Cómo definir un campo que siempre debe tener valor (non-null)?
<details>
<summary>Respuesta</summary>
```typescript
@Field()  // Por defecto es non-null
nombre: string;

// O explícitamente
@Field(() => String, { nullable: false })
nombre: string;
```
</details>

### 5.5 Resolvers

**P5.5.1** ¿Qué es un Resolver en GraphQL?
<details>
<summary>Respuesta</summary>
Un Resolver es una clase que contiene la lógica para resolver queries, mutations y campos de un tipo. Actúa como el controlador de GraphQL.
</details>

**P5.5.2** ¿Cómo se define un Resolver?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Resolver()` en una clase:
```typescript
@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private usuariosService: UsuariosService) {}

  @Query(() => Usuario)
  usuario(@Args('id') id: number) {
    return this.usuariosService.obtenerPorId(id);
  }

  @Mutation(() => Usuario)
  crearUsuario(@Args('input') input: CrearUsuarioInput) {
    return this.usuariosService.crear(input);
  }

  @ResolveField()
  artículos(@Parent() usuario: Usuario) {
    return this.articulosService.obtenerPorUsuario(usuario.id);
  }
}
```
</details>

**P5.5.3** ¿Qué es `@Parent()` en un Resolver?
<details>
<summary>Respuesta</summary>
`@Parent()` proporciona acceso al objeto padre cuando se resuelve un campo anidado:
```typescript
@ResolveField()
artículos(@Parent() usuario: Usuario) {
  return this.articulosService.obtenerPorUsuario(usuario.id);
}
```
</details>

**P5.5.4** ¿Cómo registrar un Resolver en un módulo?
<details>
<summary>Respuesta</summary>
Añadiendo el Resolver al array `providers` del módulo:
```typescript
@Module({
  providers: [UsuarioResolver, UsuariosService],
})
export class UsuariosModule {}
```
</details>

### 5.6 Validación de Argumentos

**P5.6.1** ¿Cómo se valida el tipo de argumentos en GraphQL?
<details>
<summary>Respuesta</summary>
GraphQL valida automáticamente los tipos definidos en el esquema. Sin embargo, para validación personalizada, se pueden usar Pipes:
```typescript
@Query(() => Usuario)
usuario(
  @Args('id', new ParseIntPipe()) id: number,
) {
  return this.usuariosService.obtenerPorId(id);
}
```
</details>

**P5.6.2** ¿Cómo usar decoradores de validación en Mutations?
<details>
<summary>Respuesta</summary>
```typescript
@InputType()
export class CrearUsuarioInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Field()
  @IsEmail()
  email: string;
}

@Mutation(() => Usuario)
crearUsuario(
  @Args('input', new ValidationPipe()) input: CrearUsuarioInput,
) {
  return this.usuariosService.crear(input);
}
```
</details>

### 5.7 Subscriptions

**P5.7.1** ¿Qué es una Subscription en GraphQL?
<details>
<summary>Respuesta</summary>
Una Subscription es una operación que permite al cliente suscribirse a cambios en tiempo real. Es similar a WebSocket, pero a nivel de GraphQL.
</details>

**P5.7.2** ¿Cómo se define una Subscription?
<details>
<summary>Respuesta</summary>
Usando el decorador `@Subscription()`:
```typescript
@Resolver(() => Artículo)
export class ArticuloResolver {
  @Subscription(() => Artículo)
  articuloCreado() {
    return pubSub.asyncIterator(['articuloCreado']);
  }
}
```
</details>

---

## SECCIÓN 6: INTEGRACIÓN Y PATRONES AVANZADOS

### 6.1 Validación

**P6.1.1** ¿Cuál es la recomendación de NestJS para validar datos?
<details>
<summary>Respuesta</summary>
Usar el `ValidationPipe` junto con decoradores de `class-validator`. Esto valida automáticamente DTOs y rechaza solicitudes inválidas.
</details>

**P6.1.2** ¿Cómo se habilita la validación global?
<details>
<summary>Respuesta</summary>
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```
</details>

### 6.2 Guards y Interceptors

**P6.2.1** ¿Cuál es la diferencia entre un Guard y un Interceptor?
<details>
<summary>Respuesta</summary>
- **Guard**: Ejecuta lógica antes del manejador (típicamente para autenticación/autorización). Puede permitir o denegar la solicitud.
- **Interceptor**: Ejecuta lógica antes y después del manejador. Puede modificar el request/response.
</details>

**P6.2.2** ¿Cómo se define un Guard?
<details>
<summary>Respuesta</summary>
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user;  // true si el usuario existe
  }
}

// Usar en controlador
@Controller('usuarios')
export class UsuariosController {
  @Get()
  @UseGuards(AuthGuard)
  obtenerTodos() {}
}
```
</details>

### 6.3 Excepciones

**P6.3.1** ¿Cuáles son las excepciones HTTP incorporadas en NestJS?
<details>
<summary>Respuesta</summary>
- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `ConflictException` (409)
- `InternalServerErrorException` (500)
</details>

**P6.3.2** ¿Cómo se lanzan excepciones en un servicio?
<details>
<summary>Respuesta</summary>
```typescript
@Injectable()
export class UsuariosService {
  obtenerPorId(id: number): Usuario {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return usuario;
  }
}
```
</details>

### 6.4 Estructura de Proyecto

**P6.4.1** ¿Cuál es la estructura recomendada de un proyecto NestJS?
<details>
<summary>Respuesta</summary>
```
src/
  modulos/
    usuarios/
      usuarios.controller.ts
      usuarios.service.ts
      usuarios.module.ts
      dto/
        crear-usuario.dto.ts
      entities/
        usuario.entity.ts
    artículos/
      articulos.controller.ts
      articulos.service.ts
      articulos.module.ts
  app.module.ts
  main.ts
test/
```
</details>

**P6.4.2** ¿Cuál es el patrón recomendado de organización de módulos?
<details>
<summary>Respuesta</summary>
Feature-based (basado en características):
- Cada característica/dominio tiene su propio módulo
- Dentro de cada módulo: controller, service, entity, dto
- Esto mejora la escalabilidad y mantenibilidad
</details>

---

## SECCIÓN 7: TESTING

### 7.1 Testing con TypeORM

**P7.1.1** ¿Cómo se mockea un repositorio en tests?
<details>
<summary>Respuesta</summary>
```typescript
const mockRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

TestingModule.createTestingModule({
  providers: [
    UsuariosService,
    {
      provide: getRepositoryToken(Usuario),
      useValue: mockRepository,
    },
  ],
}).compile();
```
</details>

**P7.1.2** ¿Cómo se escriben tests para un controlador?
<details>
<summary>Respuesta</summary>
```typescript
describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [UsuariosService],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('debe retornar un array de usuarios', async () => {
    const usuarios = [{ id: 1, nombre: 'Juan' }];
    jest.spyOn(service, 'obtenerTodos').mockResolvedValue(usuarios);

    const resultado = await controller.obtenerTodos();
    expect(resultado).toEqual(usuarios);
  });
});
```
</details>

---

## SECCIÓN 8: PREGUNTAS DE INTEGRACIÓN (MULTIPLE CONCEPTOS)

**P8.1** Describe el flujo completo de una solicitud GET en NestJS (desde controlador hasta base de datos).
<details>
<summary>Respuesta</summary>
1. Cliente hace GET /usuarios/1
2. Controlador recibe en handler `@Get(':id')`
3. Controlador extrae el parámetro con `@Param('id')`
4. Controlador llama al servicio
5. Servicio inyecta el repositorio
6. Repositorio ejecuta `find({ where: { id: 1 } })`
7. TypeORM ejecuta SQL query
8. Base de datos retorna el resultado
9. Servicio retorna al controlador
10. Controlador retorna al cliente (NestJS serializa automáticamente a JSON)
</details>

**P8.2** ¿Cómo se implementaría un CRUD completo combinando REST + TypeORM?
<details>
<summary>Respuesta</summary>
```typescript
// Entity
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  nombre: string;
}

// DTO
export class CrearUsuarioDto {
  nombre: string;
}

// Service
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}
  
  crear(dto: CrearUsuarioDto) { return this.repo.save(dto); }
  obtenerTodos() { return this.repo.find(); }
  obtenerPorId(id: number) { return this.repo.findOneBy({ id }); }
  actualizar(id: number, dto: CrearUsuarioDto) { 
    return this.repo.update(id, dto); 
  }
  eliminar(id: number) { return this.repo.delete(id); }
}

// Controller
@Controller('usuarios')
export class UsuariosController {
  constructor(private service: UsuariosService) {}
  
  @Post()
  crear(@Body() dto: CrearUsuarioDto) { return this.service.crear(dto); }
  
  @Get()
  obtenerTodos() { return this.service.obtenerTodos(); }
  
  @Get(':id')
  obtenerPorId(@Param('id') id: number) { 
    return this.service.obtenerPorId(id); 
  }
  
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: CrearUsuarioDto) {
    return this.service.actualizar(id, dto);
  }
  
  @Delete(':id')
  eliminar(@Param('id') id: number) { return this.service.eliminar(id); }
}
```
</details>

**P8.3** ¿Cómo se combinarían WebSocket + REST en la misma aplicación?
<details>
<summary>Respuesta</summary>
```typescript
// Gateway WebSocket
@WebSocketGateway()
export class NotificacionesGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() { console.log('WebSocket iniciado'); }

  notificar(evento: string, datos: any) {
    this.server.emit(evento, datos);
  }
}

// Service que usa ambos
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private repo: Repository<Usuario>,
    private notificacionesGateway: NotificacionesGateway,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const usuario = await this.repo.save(dto);
    // Notificar a clientes WebSocket
    this.notificacionesGateway.notificar('usuarioCreado', usuario);
    return usuario;
  }
}

// Controller REST sigue siendo igual
@Controller('usuarios')
export class UsuariosController {
  @Post()
  crear(@Body() dto: CrearUsuarioDto) { 
    return this.service.crear(dto); 
  }
}
```
</details>

**P8.4** ¿Cómo se combinarían GraphQL + TypeORM?
<details>
<summary>Respuesta</summary>
```typescript
// Entity (igual)
@Entity()
@ObjectType()
export class Usuario {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;
  
  @Column()
  @Field()
  nombre: string;
}

// Resolver
@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(
    private service: UsuariosService,
  ) {}

  @Query(() => Usuario)
  usuario(@Args('id') id: number) {
    return this.service.obtenerPorId(id);
  }

  @Query(() => [Usuario])
  usuarios() {
    return this.service.obtenerTodos();
  }

  @Mutation(() => Usuario)
  crearUsuario(@Args('input') input: CrearUsuarioInput) {
    return this.service.crear(input);
  }

  @Mutation(() => Boolean)
  eliminarUsuario(@Args('id') id: number) {
    return this.service.eliminar(id);
  }
}

// Service (igual a REST)
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private repo: Repository<Usuario>,
  ) {}

  crear(dto) { return this.repo.save(dto); }
  obtenerTodos() { return this.repo.find(); }
  obtenerPorId(id: number) { return this.repo.findOneBy({ id }); }
  eliminar(id: number) { return this.repo.delete(id); }
}
```
</details>

---

## SECCIÓN 9: CASOS DE USO PRÁCTICOS

**P9.1** ¿Cómo autenticar usuarios en una API REST?
<details>
<summary>Respuesta</summary>
Ver sección 6.2 sobre Guards. Típicamente:
1. Usuario envía credenciales en POST /login
2. Servicio verifica en base de datos
3. Se genera un JWT token
4. Cliente envía token en header Authorization
5. Guard valida token en cada solicitud protegida
</details>

**P9.2** ¿Cómo implementar paginación en GraphQL?
<details>
<summary>Respuesta</summary>
```typescript
@InputType()
export class PaginationInput {
  @Field()
  limit: number;

  @Field()
  offset: number;
}

@Query(() => [Usuario])
usuarios(@Args('pagination') pagination: PaginationInput) {
  return this.service.obtenerTodos(pagination.limit, pagination.offset);
}
```
</details>

**P9.3** ¿Cómo manejar errores personalizados?
<details>
<summary>Respuesta</summary>
Ver sección 6.3. Usar excepciones HTTP incorporadas o crear custom exception filters.
</details>

---

## SECCIÓN 10: PREGUNTAS TEÓRICAS

**P10.1** ¿Cuáles son las ventajas de usar NestJS sobre Express puro?
<details>
<summary>Respuesta</summary>
- Arquitectura opinionada y escalable
- Inyección de dependencias incorporada
- Decoradores TypeScript
- Módulos y organización clara
- Validación integrada
- Testing facilitado
- Soporte para múltiples protocolos (HTTP, WebSocket, GraphQL, etc.)
</details>

**P10.2** ¿Por qué es importante el padrón Repository en TypeORM?
<details>
<summary>Respuesta</summary>
- Abstrae la lógica de acceso a datos
- Facilita testing (se puede mockear el repositorio)
- Permite cambiar de BD sin modificar la lógica de negocio
- Centraliza queries complejas
- Mejora la mantenibilidad
</details>

**P10.3** ¿Cuáles son las diferencias arquitectónicas entre GraphQL y REST?
<details>
<summary>Respuesta</summary>
**REST**:
- Multiple endpoints
- HTTP methods (GET, POST, PUT, DELETE)
- Estructura fija de respuestas
- Over-fetching / Under-fetching

**GraphQL**:
- Single endpoint
- Query / Mutation / Subscription
- Cliente especifica qué datos necesita
- Evita over/under-fetching
- Fuertemente tipado
</details>

**P10.4** ¿Cuándo usar WebSocket vs REST vs GraphQL?
<details>
<summary>Respuesta</summary>
- **REST**: CRUD básico, operaciones simples
- **WebSocket**: Comunicación en tiempo real, bidireccional (chat, notificaciones)
- **GraphQL**: APIs complejas con múltiples relaciones, flexibilidad en datos
- **Combinación**: A menudo se usan juntos (REST + WebSocket para notificaciones, GraphQL + WebSocket para subscriptions)
</details>

---

## RESPUESTAS CLAVE DE UNA LÍNEA

| Pregunta | Respuesta |
|----------|-----------|
| ¿Qué es un módulo en NestJS? | Una clase decorada con `@Module()` que organiza providers, controllers e imports |
| ¿Cuál es el código status de POST por defecto? | 201 (Created) |
| ¿Qué validamos con `@Param()`? | Parámetros de ruta (path parameters) |
| ¿Cuál es el método HTTP para actualizar parcialmente? | `@Patch()` |
| ¿Cómo se define una entidad TypeORM? | Con `@Entity()` y decoradores de columnas como `@Column()` |
| ¿Qué es un Query en GraphQL? | Una operación de lectura (GET equivalente) |
| ¿Qué es una Mutation en GraphQL? | Una operación de escritura (POST/PUT/DELETE equivalente) |
| ¿Cómo se maneja el ciclo de vida en gateways? | Con interfaces como `OnGatewayInit`, `OnGatewayConnection`, `OnGatewayDisconnect` |
| ¿Cuál es la diferencia entre `delete()` y `remove()`? | `delete()` ejecuta SQL directo; `remove()` carga la entidad y ejecuta hooks |
| ¿Qué es una room en WebSocket? | Un grupo de clientes para enviar mensajes dirigidos |

---

**Última actualización**: Basado en documentación oficial NestJS (https://docs.nestjs.com/)
**Nivel**: Intermedio a Avanzado
**Temas cubiertos**: TypeORM, REST, WebSocket, GraphQL, Testing, Patrones de arquitectura
