import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Conferencia } from "../../../dominio/entities";
import { CrearConferenciaDto, ActualizarConferenciaDto } from "../../../dominio/dto";
import { UsuarioService } from "../usuario/usuario.service";

@Injectable()
export class ConferenciaService {
  private readonly logger = new Logger(ConferenciaService.name);

  constructor(
    @InjectRepository(Conferencia)
    private conferenciaRepository: Repository<Conferencia>,
    private usuarioService: UsuarioService,
    private readonly httpService: HttpService
  ) {}

  async create(crearConferenciaDto: CrearConferenciaDto): Promise<Conferencia> {
    // Verificar que el organizador existe
    await this.usuarioService.findOne(crearConferenciaDto.organizadorId);

    // Validar que fechaFin sea posterior a fechaInicio
    if (crearConferenciaDto.fechaFin <= crearConferenciaDto.fechaInicio) {
      throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    const conferencia = this.conferenciaRepository.create(crearConferenciaDto);
    const conferenciaGuardada = await this.conferenciaRepository.save(conferencia);

    // Llamar al webhook después de crear
    await this.llamarWebhook(conferenciaGuardada.id, "CREATE", conferenciaGuardada);

    return conferenciaGuardada;
  }

  async findAll(): Promise<Conferencia[]> {
    return await this.conferenciaRepository.find({
      relations: ["organizador", "agendas"],
    });
  }

  async findOne(id: string): Promise<Conferencia> {
    const conferencia = await this.conferenciaRepository.findOne({
      where: { id },
      relations: ["organizador", "agendas"],
    });
    if (!conferencia) {
      throw new NotFoundException(`Conferencia con ID ${id} no encontrada`);
    }
    return conferencia;
  }

  async findByEstado(estado: string): Promise<Conferencia[]> {
    return await this.conferenciaRepository.find({
      where: { estado },
      relations: ["organizador", "agendas"],
    });
  }

  async update(id: string, actualizarConferenciaDto: ActualizarConferenciaDto): Promise<Conferencia> {
    const conferencia = await this.findOne(id);

    // Validar fechas si se actualizan
    if (actualizarConferenciaDto.fechaInicio && actualizarConferenciaDto.fechaFin) {
      if (actualizarConferenciaDto.fechaFin <= actualizarConferenciaDto.fechaInicio) {
        throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    Object.assign(conferencia, actualizarConferenciaDto);
    const conferenciaActualizada = await this.conferenciaRepository.save(conferencia);

    // Llamar al webhook después de actualizar
    await this.llamarWebhook(conferenciaActualizada.id, "UPDATE", conferenciaActualizada);

    return conferenciaActualizada;
  }

  private async llamarWebhook(id: string, tipoOperacion: "CREATE" | "UPDATE", datos: any): Promise<void> {
    try {
      const payload = {
        id,
        tipoOperacion,
        datos,
      };

      await firstValueFrom(
        this.httpService.post(`http://localhost:3000/webhook/conferencias`, payload)
      );
      this.logger.log(`Webhook llamado para conferencia ${id} - ${tipoOperacion}`);
    } catch (error) {
      this.logger.error(`Error al llamar webhook para conferencia ${id}:`, error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  async remove(id: string): Promise<void> {
    const conferencia = await this.findOne(id);
    await this.conferenciaRepository.remove(conferencia);
  }

  // Endpoint especializado: Inscribir usuario a conferencia
  async inscribirUsuario(conferenciaId: string): Promise<Conferencia> {
    const conferencia = await this.findOne(conferenciaId);

    if (conferencia.inscritos >= conferencia.capacidadMaxima) {
      throw new BadRequestException("La conferencia ha alcanzado su capacidad máxima");
    }

    if (conferencia.estado !== "activa") {
      throw new BadRequestException("Solo se pueden inscribir usuarios a conferencias activas");
    }

    conferencia.inscritos += 1;
    return await this.conferenciaRepository.save(conferencia);
  }

  // Endpoint especializado: Obtener conferencias disponibles (con cupos)
  async findDisponibles(): Promise<Conferencia[]> {
    return await this.conferenciaRepository
      .createQueryBuilder("conferencia")
      .where("conferencia.estado = :estado", { estado: "activa" })
      .andWhere("conferencia.inscritos < conferencia.capacidadMaxima")
      .leftJoinAndSelect("conferencia.organizador", "organizador")
      .leftJoinAndSelect("conferencia.agendas", "agendas")
      .getMany();
  }
}

