import type ICliente from "./ICliente";
import type IMascotas from "./IMascotas";
import type IServicio from "./IServicio";

export default interface IReserva {
    reservaId: number;
    fecha: Date;
    cliente: ICliente;
    mascota: IMascotas;
    servicio: IServicio;
}