//hecho por derlis

export interface IUsuario {
    id_usuario: string;
    nombre: string;
    email: string;
    rol: 'cliente' | 'arquitecto' | 'moderador';
    estado: 'activo' | 'suspendido';
    password: string;
    fechaRegistro: Date;
    foto_perfil?: string; // URL de la foto de perfil (opcional)
}

