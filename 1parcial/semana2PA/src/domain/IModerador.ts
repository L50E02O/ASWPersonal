//hecho por Derlis

import type { IUsuario } from './IUsuario.js';

interface moderador {
    id_moderador: number;
    usuario: IUsuario; // Relación con Usuario
}