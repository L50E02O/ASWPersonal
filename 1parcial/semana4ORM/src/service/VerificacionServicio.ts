import "reflect-metadata";
import { AppDataSource } from "../config/datasource";
import { Verificacion } from "../entities/Verificacion";
 //Hecho por Leo Holguin
export class VerificacionService {
  private get repo() {
    return AppDataSource.getRepository(Verificacion);
  }

  async init() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async crearVerificacion(data: Partial<Verificacion>) {
    await this.init();
    const v = this.repo.create(data as Verificacion);
    return await this.repo.save(v);
  }

  async obtenerTodos() {
    await this.init();
    return await this.repo.find();
  }

  async obtenerPorId(id: string) {
    await this.init();
    return await this.repo.findOneBy({ id_verificacion: id });
  }

  async actualizarVerificacion(id: string, cambios: Partial<Verificacion>) {
    await this.init();
    await this.repo.update(id, cambios);
    return await this.repo.findOneBy({ id_verificacion: id });
  }

  async eliminarVerificacion(id: string) {
    await this.init();
    return await this.repo.delete(id);
  }
}

const verificacionService = new VerificacionService();
export default verificacionService;
