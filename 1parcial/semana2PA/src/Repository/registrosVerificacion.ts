// repositorio hecho por derlis 

import IVerificacion from "../domain/IVerificacion";

export const registroVerificaciones: IVerificacion[] = [
    {
        id_verificacion: "V001",
        id_arquitecto: "A001",
        documentos_adjuntos: "documentos.pdf",
        estado: "pendiente",
        fecha_verificacion: new Date("2025-01-10"),
        id_moderador: "M002"
    },
    {
        id_verificacion: "V002",
        id_arquitecto: "A002",
        documentos_adjuntos: "documentos.pdf",
        estado: "verificado",
        fecha_verificacion: new Date("2025-02-15"),
        id_moderador: "M002"
    },
    {
        id_verificacion: "V003",
        id_arquitecto: "A003",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V004",
        id_arquitecto: "A004",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V005",
        id_arquitecto: "A005",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V006",
        id_arquitecto: "A006",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V007",
        id_arquitecto: "A007",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V008",
        id_arquitecto: "A008",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V009",
        id_arquitecto: "A009",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    },
    {
        id_verificacion: "V010",
        id_arquitecto: "A010",
        documentos_adjuntos: "ddocumentos.pdf",
        estado: "rechazado",
        fecha_verificacion: new Date("2025-03-20"),
        id_moderador: "M001"
    }
];
