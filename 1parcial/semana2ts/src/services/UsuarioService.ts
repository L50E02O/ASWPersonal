import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/Usuario";

export class UsuarioService {
  private usuarioRepository: Repository<Usuario>;

  constructor() {
    this.usuarioRepository = AppDataSource.getRepository(Usuario);
  }

  // CREATE - Crear un nuevo usuario
  async createUsuario(usuarioData: {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
  }): Promise<Usuario> {
    const nuevoUsuario = this.usuarioRepository.create(usuarioData);
    return await this.usuarioRepository.save(nuevoUsuario);
  }

  // PROCESS - Procesar/Leer usuarios (obtener todos o uno específico)
  async processUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ["conferencias", "pagos"],
    });
  }

  async processUsuarioById(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { id },
      relations: ["conferencias", "pagos"],
    });
  }

  async processUsuarioByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      relations: ["conferencias", "pagos"],
    });
  }

  // MODIFY - Modificar un usuario existente
  async modifyUsuario(
    id: number,
    usuarioData: Partial<{
      nombre: string;
      email: string;
      telefono: string;
      password: string;
    }>
  ): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      return null;
    }

    Object.assign(usuario, usuarioData);
    return await this.usuarioRepository.save(usuario);
  }
}

