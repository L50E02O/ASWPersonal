import { AppDataSource } from "../config/datasource";
import { Arquitecto } from "../entities/Arquitecto";
//hecho por derlis
export class ArquitectoService {
  private repo = AppDataSource.getRepository(Arquitecto);

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOneBy({ id_arquitecto: id });
  }

  async create(data: Partial<Arquitecto>) {
    const nuevo = this.repo.create(data);
    return this.repo.save(nuevo);
  }

  async update(id: number, data: Partial<Arquitecto>) {
    await this.repo.update({ id_arquitecto: id }, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete({ id_arquitecto: id });
  }
}
