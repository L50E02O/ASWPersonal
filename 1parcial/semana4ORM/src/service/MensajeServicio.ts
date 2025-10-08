import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { Mensaje } from "../entities/Mensaje";

const mensajeRepository = AppDataSource.getRepository(Mensaje);

export class MensajeService {
    async crearMensaje(data: Partial<Mensaje>): Promise<Mensaje> {
        const mensaje = mensajeRepository.create(data);
        return await mensajeRepository.save(mensaje);
    }

    async obtenerMensajes(): Promise<Mensaje[]> {
        return await mensajeRepository.find();
    }

    async obtenerMensajePorId(id: number): Promise<Mensaje | null> {
        return await mensajeRepository.findOneBy({ id_mensaje: id });
    }

    async actualizarMensaje(id: number, data: Partial<Mensaje>): Promise<Mensaje | null> {
        const mensaje = await mensajeRepository.findOneBy({ id_mensaje: id });
        if (!mensaje) return null;
        mensajeRepository.merge(mensaje, data);
        return await mensajeRepository.save(mensaje);
    }

    async eliminarMensaje(id: number): Promise<boolean> {
        const result = await mensajeRepository.delete(id);
        return result.affected !== 0;
    }
}