import "reflect-metadata";
import { AppDataSource } from "../config/datasource";
import { Moderador } from "../entities/Moderador";
 //Hecho por Leo Holguin
export class ModeradorService {
  private get repo() {
    return AppDataSource.getRepository(Moderador);
  }

  async init() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async crearModerador(data: Partial<Moderador>) {
    await this.init();
    const moderador = this.repo.create(data as Moderador);
    return await this.repo.save(moderador);
  }

  async obtenerTodos() {
    await this.init();
    return await this.repo.find();
  }

  async obtenerPorId(id: number) {
    await this.init();
    return await this.repo.findOneBy({ id_moderador: id });
  }

  async actualizarModerador(id: number, cambios: Partial<Moderador>) {
    await this.init();
    await this.repo.update(id, cambios);
    return await this.repo.findOneBy({ id_moderador: id });
  }

  async eliminarModerador(id: number) {
    await this.init();
    return await this.repo.delete(id);
  }
}

const moderadorService = new ModeradorService();
export default moderadorService;
