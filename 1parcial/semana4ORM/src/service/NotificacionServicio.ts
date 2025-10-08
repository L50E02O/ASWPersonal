import "reflect-metadata";
import { AppDataSource } from "../config/datasource";
import { Notificacion } from "../entities/Notificacion";
 //Hecho por Leo Holguin
export class NotificacionService {
  private get repo() {
    return AppDataSource.getRepository(Notificacion);
  }

  async init() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async crearNotificacion(data: Partial<Notificacion>) {
    await this.init();
    const n = this.repo.create(data as Notificacion);
    return await this.repo.save(n);
  }

  async obtenerTodos() {
    await this.init();
    return await this.repo.find();
  }

  async obtenerPorId(id: number) {
    await this.init();
    return await this.repo.findOneBy({ id_notificacion: id } as any);
  }

  async actualizarNotificacion(id: number, cambios: Partial<Notificacion>) {
    await this.init();
    await this.repo.update(id, cambios as any);
    return await this.repo.findOneBy({ id_notificacion: id } as any);
  }

  async eliminarNotificacion(id: number) {
    await this.init();
    return await this.repo.delete(id);
  }
}

const notificacionService = new NotificacionService();
export default notificacionService;
