import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { SolicitudProyecto } from "../entities/SolicitudProyecto";


const solicitudRepository =  AppDataSource.getRepository(SolicitudProyecto);

export class SercicioSolicitud {
    async crearSolicitud(data: Partial<SolicitudProyecto>): Promise<SolicitudProyecto> {
        const solicitud = solicitudRepository.create(data);
        return await solicitudRepository.save(solicitud);
    }

    async obtenerSolicitudes(): Promise<SolicitudProyecto[]> {
        return await solicitudRepository.find();
    }

    async obtenerSolicitudPorId(id: string): Promise<SolicitudProyecto | null> {
        return await solicitudRepository.findOneBy({ id_solicitud: id });
    }

    async actualizarSolicitud(id: string, data: Partial<SolicitudProyecto>): Promise<SolicitudProyecto | null> {
        const solicitud = await solicitudRepository.findOneBy({ id_solicitud: id });
        if (!solicitud) return null;
        solicitudRepository.merge(solicitud, data);
        return await solicitudRepository.save(solicitud);
    }

    async eliminarSolicitud(id: string): Promise<boolean> {
        const result = await solicitudRepository.delete(id);
        return result.affected !== 0;
    }
}