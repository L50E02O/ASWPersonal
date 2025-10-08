import "reflect-metadata";
import { AppDataSource } from "./config/datasource";
import { Arquitecto } from "./entities/Arquitecto";
import { Avance } from "./entities/Avance";
import { Cliente } from "./entities/Cliente";
import { Conversacion } from "./entities/Conversacion";
import { Imagen } from "./entities/Imagen";
import { Incidencia, EstadoIncidencia } from "./entities/Incidencia";
import { Mensaje } from "./entities/Mensaje";
import { Moderador } from "./entities/Moderador";
import { Notificacion } from "./entities/Notificacion";
import { Proyecto } from "./entities/Proyecto";
import { SolicitudProyecto } from "./entities/SolicitudProyecto";
import { Usuario, Rol, Estado } from "./entities/Usuario";
import { Valoracion } from "./entities/Valoracion";
import { Verificacion, EstadoVerificacion } from "./entities/Verificacion";

export async function seed() {
    await AppDataSource.initialize();

    // Usuarios
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const usuario1 = usuarioRepo.create({
        nombre: "Juan",
        email: "juan@mail.com",
        rol: Rol.CLIENTE,
        estado: Estado.ACTIVO,
        password: "1234",
        fechaRegistro: new Date(),
        verificado: true,
        vistas_perfil: 5,
        especialidades: [],
        foto_perfil: "juan.jpg",
        ubicacion: "Ciudad A"
    });
    const usuario2 = usuarioRepo.create({
        nombre: "Ana",
        email: "ana@mail.com",
        rol: Rol.ARQUITECTO,
        estado: Estado.ACTIVO,
        password: "5678",
        fechaRegistro: new Date(),
        verificado: false,
        vistas_perfil: 2,
        especialidades: ["Residencial", "Comercial"],
        foto_perfil: "ana.jpg",
        ubicacion: "Ciudad B"
    });
    const usuario3 = usuarioRepo.create({
        nombre: "Mario",
        email: "mario@mail.com",
        rol: Rol.MODERADOR,
        estado: Estado.ACTIVO,
        password: "9999",
        fechaRegistro: new Date(),
        verificado: true,
        vistas_perfil: 0,
        especialidades: [],
        foto_perfil: "mario.jpg",
        ubicacion: "Ciudad C"
    });
    await usuarioRepo.save([usuario1, usuario2, usuario3]);

    // Moderadores
    const moderadorRepo = AppDataSource.getRepository(Moderador);
    const moderador1 = moderadorRepo.create({ usuario: usuario3 });
    await moderadorRepo.save(moderador1);

    // Clientes
    const clienteRepo = AppDataSource.getRepository(Cliente);
    const cliente1 = clienteRepo.create({
        usuario: usuario1,
        identificacion: "12345678",
        solicitudes: [],
        valoraciones: []
    });
    await clienteRepo.save(cliente1);

    // Arquitectos
    const arquitectoRepo = AppDataSource.getRepository(Arquitecto);
    const arquitecto1 = arquitectoRepo.create({
        cedula: "87654321",
        valoracion_prom_proyecto: 4.5,
        descripcion: "Arquitecto con experiencia",
        especialidades: ["Residencial", "Comercial"],
        ubicacion: "Ciudad B",
        verificado: false,
        vistas_perfil: 2,
        usuario: usuario2,
        solicitudes: []
    });
    await arquitectoRepo.save(arquitecto1);

    // Proyectos
    const proyectoRepo = AppDataSource.getRepository(Proyecto);
    const proyecto1 = proyectoRepo.create({
        arquitecto: arquitecto1,
        cliente: cliente1,
        titulo_proyecto: "Casa Moderna",
        valoracion_promedio: 4.8,
        descripcion: "Proyecto de casa moderna",
        tipo_proyecto: "contratado",
        fecha_publicacion: new Date(),
        avances: [],
        imagenes: [],
        valoraciones: []
    });
    await proyectoRepo.save(proyecto1);

    // Avances
    const avanceRepo = AppDataSource.getRepository(Avance);
    const avance1 = avanceRepo.create({
        descripcion: "Cimientos listos",
        fecha: new Date(),
        proyecto: proyecto1
    });
    await avanceRepo.save(avance1);

    // Imagenes
    const imagenRepo = AppDataSource.getRepository(Imagen);
    const imagen1 = imagenRepo.create({
        imagen_url: "https://ejemplo.com/img1.jpg",
        fecha: new Date(),
        proyecto: proyecto1,
        avance: avance1
    });
    await imagenRepo.save(imagen1);

    // Conversaciones
    const conversacionRepo = AppDataSource.getRepository(Conversacion);
    const conversacion1 = conversacionRepo.create({
        cliente: cliente1,
        id_cliente: cliente1.id_cliente,
        arquitecto: arquitecto1,
        id_arquitecto: arquitecto1.id_arquitecto,
        mensaje: "Hola, ¿cómo va el proyecto?",
        fecha: new Date()
    });
    await conversacionRepo.save(conversacion1);

    // Mensajes
    const mensajeRepo = AppDataSource.getRepository(Mensaje);
    const mensaje1 = mensajeRepo.create({
        conversacion: conversacion1,
        id_conversacion: conversacion1.id_conversacion,
        remitente: usuario1,
        id_remitente: usuario1.id_usuario,
        contenido: "¿Cuándo estará listo el plano?",
        fecha_envio: new Date(),
        leido: false,
        imagenes: ["https://ejemplo.com/img1.jpg"]
    });
    await mensajeRepo.save(mensaje1);

    // Incidencias
    const incidenciaRepo = AppDataSource.getRepository(Incidencia);
    const incidencia1 = incidenciaRepo.create({
        usuarioEmisor: usuario1,
        id_usuario_emisor: usuario1.id_usuario,
        usuarioReceptor: usuario2,
        id_usuario_receptor: usuario2.id_usuario,
        moderador: moderador1,
        id_moderador: moderador1.id_moderador,
        descripcion: "Incidencia por retraso",
        estado: EstadoIncidencia.PENDIENTE,
        fecha: new Date()
    });
    await incidenciaRepo.save(incidencia1);

    // Notificaciones
    const notificacionRepo = AppDataSource.getRepository(Notificacion);
    const notificacion1 = notificacionRepo.create({
        usuario: usuario1,
        mensaje: "Tienes una nueva incidencia",
        fecha: new Date()
    });
    await notificacionRepo.save(notificacion1);

    // Solicitudes de Proyecto
    const solicitudRepo = AppDataSource.getRepository(SolicitudProyecto);
    const solicitud1 = solicitudRepo.create({
        estado: "pendiente",
        fecha: new Date(),
        arquitecto: arquitecto1,
        cliente: cliente1
    });
    await solicitudRepo.save(solicitud1);

    // Valoraciones
    const valoracionRepo = AppDataSource.getRepository(Valoracion);
    const valoracion1 = valoracionRepo.create({
        cliente: cliente1,
        proyecto: proyecto1,
        calificacion: 5,
        comentario: "Excelente trabajo",
        fecha: new Date()
    });
    await valoracionRepo.save(valoracion1);

    // Verificaciones
    const verificacionRepo = AppDataSource.getRepository(Verificacion);
    const verificacion1 = verificacionRepo.create({
        arquitecto: arquitecto1,
        id_arquitecto: arquitecto1.id_arquitecto,
        moderador: moderador1,
        id_moderador: moderador1.id_moderador,
        estado: EstadoVerificacion.VERIFICADO,
        fecha_verificacion: new Date()
    });
    await verificacionRepo.save(verificacion1);

    console.log("Seed completado correctamente.");
    process.exit(0);
}

seed().catch(error => {
    console.error("Error en el seed:", error);
    process.exit(1);
});