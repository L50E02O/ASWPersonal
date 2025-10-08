import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { Conversacion } from "../entities/Conversacion";

const conversacionRepository = AppDataSource.getRepository(Conversacion);

export class ConversacionService {
    async crearConversacion(data: Partial<Conversacion>): Promise<Conversacion> {
        const conversacion = conversacionRepository.create(data);
        return await conversacionRepository.save(conversacion);
    }

    async obtenerConversaciones(): Promise<Conversacion[]> {
        return await conversacionRepository.find();
    }

    async obtenerConversacionPorId(id: number): Promise<Conversacion | null> {
        return await conversacionRepository.findOneBy({ id_conversacion: id });
    }

    async actualizarConversacion(id: number, data: Partial<Conversacion>): Promise<Conversacion | null> {
        const conversacion = await conversacionRepository.findOneBy({ id_conversacion: id });
        if (!conversacion) return null;
        conversacionRepository.merge(conversacion, data);
        return await conversacionRepository.save(conversacion);
    }

    async eliminarConversacion(id: number): Promise<boolean> {
        const result = await conversacionRepository.delete(id);
        return result.affected !== 0;
    }
}