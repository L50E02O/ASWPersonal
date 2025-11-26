import { Conferencia } from "./Conferencia";
import { Agenda } from "./Agenda";
export declare class Usuario {
    id: string;
    nombre: string;
    correo: string;
    telefono: string;
    password: string;
    fechaRegistro: Date;
    conferencias: Conferencia[];
    agendas: Agenda[];
}
