import { Usuario } from "./Usuario";
import { Conferencia } from "./Conferencia";
export declare class Agenda {
    id: string;
    fechaAgendada: Date;
    notas: string | null;
    estado: string;
    fechaCreacion: Date;
    usuario: Usuario;
    usuarioId: string;
    conferencia: Conferencia;
    conferenciaId: string;
}
