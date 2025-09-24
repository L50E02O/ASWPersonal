import type IServicio from "../domain/IServicio";
import { DtoCrearServicio } from "../dto/crearUsuario.dto";

const servicios: IServicio[] = [];


export class CRUDServicio {
    constructor(){
        console.log("Servicio Iniciado");
    }

    createServicio(nuevoServicio: DtoCrearServicio):void{
        const servicio = {
            id: servicios.length + 1,
            ...nuevoServicio
        }

        servicios.push(servicio);
    }

    readServicio(): IServicio[]{
        return servicios;
    }

    updateServicio(id: number, nuevo_servicio: IServicio):void{
        const idx_viejo_servicio = servicios.findIndex((servicio)=>servicio.id === id);
        if(idx_viejo_servicio===-1){
            console.log("Servicio no encontrado");
            return;
        }
        servicios.splice(idx_viejo_servicio, 1);
        servicios.push(nuevo_servicio);
    }

    deleteServicio(id: number):void{
        const idx_viejo_servicio = servicios.findIndex((servicio)=>servicio.id === id);
        if(idx_viejo_servicio===-1){
            console.log("Servicio no encontrado");
            return;
        }
        servicios.splice(idx_viejo_servicio, 1);
    }

    consultarPorId(id: number): IServicio{
        const servicio = servicios.find((servicio)=> servicio.id === id);
        if(!servicio){
            throw new Error("No se encontró el servicio");
        }
        return servicio;
    }
}