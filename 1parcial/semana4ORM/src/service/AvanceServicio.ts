import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { Avance } from "../entities/Avance";


const avanceRepository =  AppDataSource.getRepository(Avance);

export class AvanceService {
    async crearAvance(data: Partial<Avance>): Promise<Avance> {
        const avance = avanceRepository.create(data);
        return await avanceRepository.save(avance);
    }

    async obtenerAvances(): Promise<Avance[]> {
        return await avanceRepository.find();
    }

    async obtenerAvancePorId(id: number): Promise<Avance | null> {
        return await avanceRepository.findOneBy({ id_avance: id });
    }

    async actualizarAvance(id: number, data: Partial<Avance>): Promise<Avance | null> {
        const avance = await avanceRepository.findOneBy({ id_avance: id });
        if (!avance) return null;
        avanceRepository.merge(avance, data);
        return await avanceRepository.save(avance);
    }

    async eliminarAvance(id: number): Promise<boolean> {
        const result = await avanceRepository.delete(id);
        return result.affected !== 0;
    }
}