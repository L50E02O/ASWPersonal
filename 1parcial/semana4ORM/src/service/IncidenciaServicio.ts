import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { Incidencia } from "../entities/Incidencia";


const incidenciaRepository =  AppDataSource.getRepository(Incidencia);

export class IncidenciaService {
    async crearIncidencia(data: Partial<Incidencia>): Promise<Incidencia> {
        const incidencia = incidenciaRepository.create(data);
        return await incidenciaRepository.save(incidencia);
    }

    async obtenerIncidencias(): Promise<Incidencia[]> {
        return await incidenciaRepository.find();
    }

    async obtenerIncidenciaPorId(id: string): Promise<Incidencia | null> {
        return await incidenciaRepository.findOneBy({ id_incidencia: id });
    }

    async actualizarIncidencia(id: string, data: Partial<Incidencia>): Promise<Incidencia | null> {
        const incidencia = await incidenciaRepository.findOneBy({ id_incidencia: id });
        if (!incidencia) return null;
        incidenciaRepository.merge(incidencia, data);
        return await incidenciaRepository.save(incidencia);
    }

    async eliminarIncidencia(id: string): Promise<boolean> {
        const result = await incidenciaRepository.delete(id);
        return result.affected !== 0;
    }
}