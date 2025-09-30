export default interface IVerificacion {
    id_verificacion: string;
    id_arquitecto: string;  // FK a Arquitecto
    documentos_adjuntos: string;
    estado: "pendiente" | "verificado" | "rechazado";
    fecha_verificacion: Date;
    id_moderador: string;   // FK a Moderador
}
