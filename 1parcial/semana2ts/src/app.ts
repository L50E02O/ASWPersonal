import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { UsuarioService } from "./services/UsuarioService";
import { ConferenciaService } from "./services/ConferenciaService";
import { PagoService } from "./services/PagoService";

async function main() {
  try {
    // Inicializar la conexión a la base de datos
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida correctamente");

    // Inicializar servicios
    const usuarioService = new UsuarioService();
    const conferenciaService = new ConferenciaService();
    const pagoService = new PagoService();

    // ========== EJEMPLOS DE USO - USUARIO ==========
    console.log("\n=== OPERACIONES CON USUARIOS ===");

    // CREATE - Crear usuarios
    const usuario1 = await usuarioService.createUsuario({
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "1234567890",
      password: "password123",
    });
    console.log("Usuario creado:", usuario1);

    const usuario2 = await usuarioService.createUsuario({
      nombre: "María García",
      email: "maria@example.com",
      telefono: "0987654321",
      password: "password456",
    });
    console.log("Usuario creado:", usuario2);

    // PROCESS - Procesar/Leer usuarios
    const todosUsuarios = await usuarioService.processUsuarios();
    console.log("\nTodos los usuarios:", todosUsuarios);

    const usuarioPorId = await usuarioService.processUsuarioById(usuario1.id);
    console.log("Usuario por ID:", usuarioPorId);

    // MODIFY - Modificar usuario
    const usuarioModificado = await usuarioService.modifyUsuario(usuario1.id, {
      telefono: "1111111111",
    });
    console.log("Usuario modificado:", usuarioModificado);

    // ========== EJEMPLOS DE USO - CONFERENCIA ==========
    console.log("\n=== OPERACIONES CON CONFERENCIAS ===");

    // CREATE - Crear conferencias
    const conferencia1 = await conferenciaService.createConferencia({
      titulo: "Conferencia de TypeScript",
      descripcion: "Aprende TypeScript desde cero",
      fechaInicio: new Date("2024-12-15T10:00:00"),
      fechaFin: new Date("2024-12-15T18:00:00"),
      ubicacion: "Auditorio Principal",
      precio: 50000,
      capacidadMaxima: 100,
      organizadorId: usuario1.id,
    });
    console.log("Conferencia creada:", conferencia1);

    const conferencia2 = await conferenciaService.createConferencia({
      titulo: "Workshop de Node.js",
      descripcion: "Desarrollo backend con Node.js",
      fechaInicio: new Date("2024-12-20T09:00:00"),
      fechaFin: new Date("2024-12-20T17:00:00"),
      ubicacion: "Sala de Conferencias B",
      precio: 35000,
      capacidadMaxima: 50,
      organizadorId: usuario2.id,
    });
    console.log("Conferencia creada:", conferencia2);

    // PROCESS - Procesar/Leer conferencias
    const todasConferencias = await conferenciaService.processConferencias();
    console.log("\nTodas las conferencias:", todasConferencias);

    const conferenciaPorId = await conferenciaService.processConferenciaById(
      conferencia1.id
    );
    console.log("Conferencia por ID:", conferenciaPorId);

    // MODIFY - Modificar conferencia
    const conferenciaModificada = await conferenciaService.modifyConferencia(
      conferencia1.id,
      {
        precio: 45000,
        estado: "completa",
      }
    );
    console.log("Conferencia modificada:", conferenciaModificada);

    // ========== EJEMPLOS DE USO - PAGO ==========
    console.log("\n=== OPERACIONES CON PAGOS ===");

    // CREATE - Crear pagos
    const pago1 = await pagoService.createPago({
      monto: 50000,
      metodoPago: "tarjeta_credito",
      usuarioId: usuario1.id,
      conferenciaId: conferencia1.id,
      numeroTransaccion: "TXN-001",
    });
    console.log("Pago creado:", pago1);

    const pago2 = await pagoService.createPago({
      monto: 35000,
      metodoPago: "transferencia_bancaria",
      usuarioId: usuario2.id,
      conferenciaId: conferencia2.id,
      numeroTransaccion: "TXN-002",
    });
    console.log("Pago creado:", pago2);

    // PROCESS - Procesar/Leer pagos
    const todosPagos = await pagoService.processPagos();
    console.log("\nTodos los pagos:", todosPagos);

    const pagosPorUsuario = await pagoService.processPagosByUsuario(
      usuario1.id
    );
    console.log("Pagos del usuario:", pagosPorUsuario);

    const pagosPendientes = await pagoService.processPagosByEstado("pendiente");
    console.log("Pagos pendientes:", pagosPendientes);

    // MODIFY - Modificar pago
    const pagoModificado = await pagoService.modifyPago(pago1.id, {
      estado: "completado",
    });
    console.log("Pago modificado:", pagoModificado);

    console.log("\n=== OPERACIONES COMPLETADAS ===");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Cerrar la conexión
    await AppDataSource.destroy();
    console.log("\nConexión a la base de datos cerrada");
  }
}

main();
