# RESPUESTAS BASADAS EN DOCUMENTACIÓN OFICIAL NESTJS

1. **Dos responsabilidades servicio NestJS**
   - Encapsular lógica de negocio y reglas de dominio
   - Ser inyectados en controladores u otros servicios para promover reutilización de código

2. **Que método HTTP se usa para actualizar parcialmente un servicio**
   - `@Patch()` (actualización parcial)
   - Nota: `@Put()` se usa para reemplazar completamente un recurso

3. **Que son las mutaciones en GRAPHQL**
   - Son operaciones que causan cambios en los datos del servidor (writes/modificaciones)
   - Se define con el decorador `@Mutation()`
   - Ejemplo: `@Mutation(() => Post) async upvotePost(@Args('postId') postId: number) { ... }`

4. **Que son las rooms en WEBSOCKET**
   - Canales o grupos de comunicación dentro de una conexión WebSocket
   - Permiten dirigir mensajes a subconjuntos específicos de clientes conectados
   - Se manejan con métodos como `client.to('roomName').emit()`

5. **Indica 2 métodos CRUD propios del repositorio TypeORM**
   - `find()` - obtiene todos los registros
   - `delete(id)` - elimina un registro por ID
   - (También válidos: `save()`, `findOneBy()`, `findOne()`, `remove()`)

6. **Línea para crear un producto usando POST en NestJS controller**

```typescript
@Post()
create(@Body() createProductDto: CreateProductDto) {
  return 'This action adds a new product';
}
```

7. **Línea para eliminar un registro usando delete() en TypeORM**

```typescript
await this.usersRepository.delete(id);
```

8. **Decorador para definir un campo tipo string en GRAPHQL**

```typescript
@Field()
nombre: string;
```

O explícitamente: `@Field(() => String) nombre: string;`

9. **Código para escuchar un evento websocket llamado sendMessage**

```typescript
@SubscribeMessage('sendMessage')
handleMessage(@MessageBody() data: string): string {
  return data;
}
```

10. **Línea para crear una entidad TypeORM llamada user**

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
}
```

