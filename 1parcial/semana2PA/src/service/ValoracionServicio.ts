// hecho por Leo Holguin
import type IValoracion from "../domain/IValoracion";
import { registroValoraciones } from "../Repository/registroValoraciones";

export class servicioValoracion {
    private valoracionesRepository: IValoracion[];

    constructor() {
        this.valoracionesRepository = registroValoraciones;
        console.log("CRUD de Valoraciones Iniciado");
    }

    // CREATE con Callback
    createValoracion(nuevaValoracion: IValoracion, callback: CallableFunction): void {
        try {
            this.valoracionesRepository.push(nuevaValoracion);
            console.log("Valoración creada");
            callback(null, nuevaValoracion); // success
        } catch (error) {
            callback(error, null); // error
        }
    }

    // READ con async/await
    async readValoraciones(): Promise<IValoracion[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Valoraciones consultadas");
                resolve(this.valoracionesRepository);
            }, 1000);
        });
    }

    async readValoracionById(id: string): Promise<IValoracion | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const valoracion = this.valoracionesRepository.find(v => v.id_valoracion === id);
                if (!valoracion) {
                    console.log("Valoración no encontrada");
                    return resolve(null);
                }
                console.log("Valoración encontrada");
                resolve(valoracion);
            }, 1000);
        });
    }

    // UPDATE con Promise (mantiene el id y actualiza solo campos)
    updateValoracion(id: string, nuevaValoracion: Partial<IValoracion>): Promise<IValoracion> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.valoracionesRepository.findIndex(v => v.id_valoracion === id);
                if (index === -1) {
                    return reject("Valoración no encontrada");
                }

                this.valoracionesRepository[index] = {
                    ...this.valoracionesRepository[index],
                    ...nuevaValoracion,
                    id_valoracion: id
                } as IValoracion; 

                console.log("Valoración actualizada");
                resolve(this.valoracionesRepository[index]!); 
            }, 1000);
        });
    }

    // DELETE con async/await (más simple, sin Promise anidado)
    async deleteValoracion(id: string): Promise<string> {
        const index = this.valoracionesRepository.findIndex(v => v.id_valoracion === id);
        if (index === -1) {
            throw new Error("Valoración no encontrada");
        }
        this.valoracionesRepository.splice(index, 1);
        console.log("Valoración eliminada");
        return "Valoración eliminada con éxito";
    }
}