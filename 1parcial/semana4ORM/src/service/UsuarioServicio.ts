import "reflect-metadata";
import { AppDataSource } from "../config/datasource";
import { Usuario } from "../entities/Usuario";

//Hecho por Leo Holguin
export class UsuarioService {
  private get repo() {
    return AppDataSource.getRepository(Usuario);
  }

  async init() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async crearUsuario(data: Partial<Usuario>) {
    await this.init();
    const usuario = this.repo.create(data as Usuario);
    return await this.repo.save(usuario);
  }

  async obtenerTodos() {
    await this.init();
    return await this.repo.find();
  }

  async obtenerPorId(id: string) {
    await this.init();
    return await this.repo.findOneBy({ id_usuario: id });
  }

  async actualizarUsuario(id: string, cambios: Partial<Usuario>) {
    await this.init();
    await this.repo.update(id, cambios);
    return await this.repo.findOneBy({ id_usuario: id });
  }

  async eliminarUsuario(id: string) {
    await this.init();
    return await this.repo.delete(id);
  }
}

const usuarioService = new UsuarioService();
export default usuarioService;
