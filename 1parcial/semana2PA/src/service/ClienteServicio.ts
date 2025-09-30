import ICliente from "../domain/ICliente";
import { ClienteRepository } from "../Repository/ClienteRepository";

export class ServicioCliente {
    private repo: ClienteRepository;

    constructor(repo: ClienteRepository) {
        this.repo = repo;
    }

    // create usando el repo con callback
    create(cliente: ICliente, callback: CallableFunction): void {
        this.repo.create(cliente, callback);
    }

    // update usando el repo con promise
    update(id: string, datos: ICliente): Promise<ICliente> {
        return this.repo.update(id, datos)
        // .then((clienteActualizado)=>{
        //     console.log("Cliente Actualizado correctamente")
        //     return clienteActualizado;
        // })
        // .catch((error)=>{
        //     console.error("Error al actualizar cliente: ", error.message);
        //     throw error;
        // })
    }

    // read listado completo con async/await
    async read(): Promise<ICliente[]> {
        try {
            return await this.repo.read();
        } catch (error) {
            throw error;
        }
    }

    // read individual con async/await
    async readById(id: string): Promise<ICliente> {
        try {
            return await this.repo.readById(id);
        } catch (error) {
            throw error;
        }
    }

    // delete con async/await
    async delete(id: string): Promise<boolean> {
        try {
            return await this.repo.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
