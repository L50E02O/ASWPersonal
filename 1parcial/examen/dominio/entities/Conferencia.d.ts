import { Usuario } from "./Usuario";
import { Agenda } from "./Agenda";
export declare class Conferencia {
    id: string;
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    ubicacion: string;
    precio: number;
    capacidadMaxima: number;
    inscritos: number;
    estado: string;
    organizador: Usuario;
    organizadorId: string;
    agendas: Agenda[];
}
