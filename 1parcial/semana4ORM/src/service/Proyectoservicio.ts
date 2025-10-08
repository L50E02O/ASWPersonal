import { AppDataSource } from "../config/datasource";
import { Proyecto } from "../entities/Proyecto";
//hecho por derlis
export class ProyectoService {
  private repo = AppDataSource.getRepository(Proyecto);

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOneBy({ id_proyecto: id });
  }

  async create(data: Partial<Proyecto>) {
    const nuevo = this.repo.create(data);
    return this.repo.save(nuevo);
  }

  async update(id: number, data: Partial<Proyecto>) {
    await this.repo.update({ id_proyecto: id }, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete({ id_proyecto: id });
  }
}
