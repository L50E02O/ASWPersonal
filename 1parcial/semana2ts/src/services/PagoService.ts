import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Pago } from "../entities/Pago";

export class PagoService {
  private pagoRepository: Repository<Pago>;

  constructor() {
    this.pagoRepository = AppDataSource.getRepository(Pago);
  }

  // CREATE - Crear un nuevo pago
  async createPago(pagoData: {
    monto: number;
    metodoPago: string;
    usuarioId: number;
    conferenciaId: number;
    numeroTransaccion?: string;
  }): Promise<Pago> {
    const nuevoPago = this.pagoRepository.create(pagoData);
    return await this.pagoRepository.save(nuevoPago);
  }

  // PROCESS - Procesar/Leer pagos (obtener todos o uno específico)
  async processPagos(): Promise<Pago[]> {
    return await this.pagoRepository.find({
      relations: ["usuario", "conferencia"],
    });
  }

  async processPagoById(id: number): Promise<Pago | null> {
    return await this.pagoRepository.findOne({
      where: { id },
      relations: ["usuario", "conferencia"],
    });
  }

  async processPagosByUsuario(usuarioId: number): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { usuarioId },
      relations: ["usuario", "conferencia"],
    });
  }

  async processPagosByEstado(estado: string): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { estado },
      relations: ["usuario", "conferencia"],
    });
  }

  // MODIFY - Modificar un pago existente
  async modifyPago(
    id: number,
    pagoData: Partial<{
      monto: number;
      metodoPago: string;
      estado: string;
      numeroTransaccion: string;
    }>
  ): Promise<Pago | null> {
    const pago = await this.pagoRepository.findOne({ where: { id } });
    if (!pago) {
      return null;
    }

    Object.assign(pago, pagoData);
    return await this.pagoRepository.save(pago);
  }
}

