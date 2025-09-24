import type ICliente from "./ICliente";

export default interface IMascotas {
    mascotaId: number;
    nombre: string;
    raza: string;
    edad: number;
    clienteId: ICliente;
}
