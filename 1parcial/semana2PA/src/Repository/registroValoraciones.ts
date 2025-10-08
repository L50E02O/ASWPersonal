import IValoracion from "../domain/IValoracion";
// Hecho por Leo Holguin
export const registroValoraciones: IValoracion[] = [
    {
        id_valoracion: "1",
        id_cliente: "1",
        id_usuario: "1",
        calificacion: 5,
        comentario: "Excelente servicio",
        fecha: new Date(),
    },
    {
        id_valoracion: "2",
        id_cliente: "1",
        id_usuario: "2",
        calificacion: 4,
        comentario: "Buena atención, pero el producto llegó tarde.",
        fecha: new Date(),
    },
    {
        id_valoracion: "3",
        id_cliente: "2",
        id_usuario: "3",
        calificacion: 3,
        comentario: "El servicio fue regular, esperaba más.",
        fecha: new Date(),
    }
];
