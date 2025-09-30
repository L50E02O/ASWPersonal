// hecho por Derlis
import type IVerificacion from "../domain/IVerificacion";

const verificaciones: IVerificacion[] = [];

export class ServicioVerificacion {
    constructor() {
        console.log("CRUD de Verificaciones Iniciado");
    }

    // CREATE
    createVerificacion(nuevaVerificacion: IVerificacion, callback: CallableFunction): void {
        try {
            verificaciones.push(nuevaVerificacion);
            console.log("Verificación creada");
            callback(null, nuevaVerificacion); // success
        } catch (error) {
            callback(error, null); // error
        }
    }

    // READ todas las verificaciones
    async readVerificaciones(): Promise<IVerificacion[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Verificaciones consultadas");
                resolve(verificaciones);
            }, 1000);
        });
    }

    // READ por ID
    async readVerificacionById(id: string): Promise<IVerificacion | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const verificacion = verificaciones.find(v => v.id_verificacion === id);
                console.log(verificacion);
                if (!verificacion) {
                    console.log("Verificación no encontrada");
                    return resolve(null);
                }
                console.log("Verificación encontrada");
                resolve(verificacion);
            }, 1000);
        });
    }

    // UPDATE
    updateVerificacion(id: string, nuevaVerificacion: IVerificacion): Promise<IVerificacion> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = verificaciones.findIndex(v => v.id_verificacion === id);
                if (index === -1) {
                    return reject("Verificación no encontrada");
                }
                verificaciones[index] = nuevaVerificacion;
                console.log("Verificación actualizada");
                resolve(nuevaVerificacion);
            }, 1000);
        });
    }

    // DELETE
    async deleteVerificacion(id: string): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = verificaciones.findIndex(v => v.id_verificacion === id);
                if (index === -1) {
                    console.log("Verificación no encontrada");
                    return reject("Verificación no encontrada");
                }
                verificaciones.splice(index, 1);
                console.log("Verificación eliminada");
                resolve("Verificación eliminada con éxito");
            }, 2500);
        });
    }
}
