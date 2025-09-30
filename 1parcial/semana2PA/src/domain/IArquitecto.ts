//hehco por derlis
import type { IUsuario } from './IUsuario.js';

interface arquitecto {
    id_arquitecto: number;
    valoracion_promedio: number;
    descripcion: string;
    especialidades: string[];
    ubicacion: string;
    verificacion: boolean;
    usuario: IUsuario; // Relación con Usuario
}