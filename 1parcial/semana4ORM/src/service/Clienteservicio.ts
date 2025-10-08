import { AppDataSource } from "../config/datasource";
import { Cliente } from "../entities/Cliente";
// hecho por derlis
export class ClienteService {
  private repo = AppDataSource.getRepository(Cliente);

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOneBy({ id_cliente: id });
  }

  async create(data: Partial<Cliente>) {
    const nuevo = this.repo.create(data);
    return this.repo.save(nuevo);
  }

  async update(id: number, data: Partial<Cliente>) {
    await this.repo.update({ id_cliente: id }, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete({ id_cliente: id });
  }
}
