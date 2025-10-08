import { AppDataSource } from "../config/datasource";
import { Valoracion } from "../entities/Valoracion";
// hecho por derlis
export class ValoracionService {
  private repo = AppDataSource.getRepository(Valoracion);

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOneBy({ id_valoracion: id });
  }

  async create(data: Partial<Valoracion>) {
    const nuevo = this.repo.create(data);
    return this.repo.save(nuevo);
  }

  async update(id: number, data: Partial<Valoracion>) {
    await this.repo.update({ id_valoracion: id }, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete({ id_valoracion: id });
  }
}
