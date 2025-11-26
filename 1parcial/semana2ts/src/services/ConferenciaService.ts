import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Conferencia } from "../entities/Conferencia";

export class ConferenciaService {
  private conferenciaRepository: Repository<Conferencia>;

  constructor() {
    this.conferenciaRepository = AppDataSource.getRepository(Conferencia);
  }

  // CREATE - Crear una nueva conferencia
  async createConferencia(conferenciaData: {
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    ubicacion: string;
    precio: number;
    capacidadMaxima: number;
    organizadorId: number;
  }): Promise<Conferencia> {
    const nuevaConferencia = this.conferenciaRepository.create(conferenciaData);
    return await this.conferenciaRepository.save(nuevaConferencia);
  }

  // PROCESS - Procesar/Leer conferencias (obtener todas o una específica)
  async processConferencias(): Promise<Conferencia[]> {
    return await this.conferenciaRepository.find({
      relations: ["organizador", "pagos"],
    });
  }

  async processConferenciaById(id: number): Promise<Conferencia | null> {
    return await this.conferenciaRepository.findOne({
      where: { id },
      relations: ["organizador", "pagos"],
    });
  }

  async processConferenciasByEstado(estado: string): Promise<Conferencia[]> {
    return await this.conferenciaRepository.find({
      where: { estado },
      relations: ["organizador", "pagos"],
    });
  }

  // MODIFY - Modificar una conferencia existente
  async modifyConferencia(
    id: number,
    conferenciaData: Partial<{
      titulo: string;
      descripcion: string;
      fechaInicio: Date;
      fechaFin: Date;
      ubicacion: string;
      precio: number;
      capacidadMaxima: number;
      inscritos: number;
      estado: string;
    }>
  ): Promise<Conferencia | null> {
    const conferencia = await this.conferenciaRepository.findOne({
      where: { id },
    });
    if (!conferencia) {
      return null;
    }

    Object.assign(conferencia, conferenciaData);
    return await this.conferenciaRepository.save(conferencia);
  }
}

