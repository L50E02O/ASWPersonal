import "reflect-metadata"
import { AppDataSource } from "../config/datasource";
import { Imagen } from "../entities/Imagen";


const imagenRepository =  AppDataSource.getRepository(Imagen);

export class ImagenService {
    async crearImagen(data: Partial<Imagen>): Promise<Imagen> {
        const imagen = imagenRepository.create(data);
        return await imagenRepository.save(imagen);
    }

    async obtenerImagenes(): Promise<Imagen[]> {
        return await imagenRepository.find();
    }

    async obtenerImagenPorId(id: string): Promise<Imagen | null> {
        return await imagenRepository.findOneBy({ id_imagen: id });
    }

    async actualizarImagen(id: string, data: Partial<Imagen>): Promise<Imagen | null> {
        const imagen = await imagenRepository.findOneBy({ id_imagen: id });
        if (!imagen) return null;
        imagenRepository.merge(imagen, data);
        return await imagenRepository.save(imagen);
    }

    async eliminarImagen(id: string): Promise<boolean> {
        const result = await imagenRepository.delete(id);
        return result.affected !== 0;
    }
}