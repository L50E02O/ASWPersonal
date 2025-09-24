import type IMascotas from  "./IMascotas";
import type IReserva  from "./IReserva";


export default interface ICliente {
    idCliente: number;
    nombre: string;
    identificacion: string;
    mascotas: IMascotas[];
    reservas: IReserva[];
}