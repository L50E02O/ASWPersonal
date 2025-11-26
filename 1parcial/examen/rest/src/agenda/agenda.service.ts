import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Agenda } from "../../../dominio/entities";
import { CrearAgendaDto, ActualizarAgendaDto } from "../../../dominio/dto";
import { UsuarioService } from "../usuario/usuario.service";
import { ConferenciaService } from "../conferencia/conferencia.service";

@Injectable()
export class AgendaService {
  private readonly logger = new Logger(AgendaService.name);

  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private usuarioService: UsuarioService,
    private conferenciaService: ConferenciaService,
    private readonly httpService: HttpService
  ) {}

  async create(crearAgendaDto: CrearAgendaDto): Promise<Agenda> {
    // Verificar que el usuario existe
    await this.usuarioService.findOne(crearAgendaDto.usuarioId);

    // Verificar que la conferencia existe
    const conferencia = await this.conferenciaService.findOne(crearAgendaDto.conferenciaId);

    // Validar que la fecha agendada esté dentro del rango de la conferencia
    if (
      crearAgendaDto.fechaAgendada < conferencia.fechaInicio ||
      crearAgendaDto.fechaAgendada > conferencia.fechaFin
    ) {
      throw new BadRequestException(
        "La fecha agendada debe estar dentro del rango de fechas de la conferencia"
      );
    }

    const agenda = this.agendaRepository.create(crearAgendaDto);
    const agendaGuardada = await this.agendaRepository.save(agenda);

    // Llamar al webhook después de crear
    await this.llamarWebhook(agendaGuardada.id, "CREATE", agendaGuardada);

    return agendaGuardada;
  }

  async findAll(): Promise<Agenda[]> {
    return await this.agendaRepository.find({
      relations: ["usuario", "conferencia"],
    });
  }

  async findOne(id: string): Promise<Agenda> {
    const agenda = await this.agendaRepository.findOne({
      where: { id },
      relations: ["usuario", "conferencia"],
    });
    if (!agenda) {
      throw new NotFoundException(`Agenda con ID ${id} no encontrada`);
    }
    return agenda;
  }

  async findByUsuario(usuarioId: string): Promise<Agenda[]> {
    await this.usuarioService.findOne(usuarioId);
    return await this.agendaRepository.find({
      where: { usuarioId },
      relations: ["usuario", "conferencia"],
    });
  }

  async findByConferencia(conferenciaId: string): Promise<Agenda[]> {
    await this.conferenciaService.findOne(conferenciaId);
    return await this.agendaRepository.find({
      where: { conferenciaId },
      relations: ["usuario", "conferencia"],
    });
  }

  async findByEstado(estado: string): Promise<Agenda[]> {
    return await this.agendaRepository.find({
      where: { estado },
      relations: ["usuario", "conferencia"],
    });
  }

  async update(id: string, actualizarAgendaDto: ActualizarAgendaDto): Promise<Agenda> {
    const agenda = await this.findOne(id);

    // Si se actualiza la fecha, validar contra la conferencia
    if (actualizarAgendaDto.fechaAgendada) {
      const conferencia = agenda.conferencia;
      if (
        actualizarAgendaDto.fechaAgendada < conferencia.fechaInicio ||
        actualizarAgendaDto.fechaAgendada > conferencia.fechaFin
      ) {
        throw new BadRequestException(
          "La fecha agendada debe estar dentro del rango de fechas de la conferencia"
        );
      }
    }

    Object.assign(agenda, actualizarAgendaDto);
    const agendaActualizada = await this.agendaRepository.save(agenda);

    // Llamar al webhook después de actualizar
    await this.llamarWebhook(agendaActualizada.id, "UPDATE", agendaActualizada);

    return agendaActualizada;
  }

  private async llamarWebhook(id: string, tipoOperacion: "CREATE" | "UPDATE", datos: any): Promise<void> {
    try {
      const payload = {
        id,
        tipoOperacion,
        datos,
      };

      await firstValueFrom(
        this.httpService.post(`http://localhost:3000/webhook/agendas`, payload)
      );
      this.logger.log(`Webhook llamado para agenda ${id} - ${tipoOperacion}`);
    } catch (error) {
      this.logger.error(`Error al llamar webhook para agenda ${id}:`, error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  async remove(id: string): Promise<void> {
    const agenda = await this.findOne(id);
    await this.agendaRepository.remove(agenda);
  }

  // Endpoint especializado: Confirmar agenda
  async confirmarAgenda(id: string): Promise<Agenda> {
    const agenda = await this.findOne(id);
    agenda.estado = "confirmada";
    return await this.agendaRepository.save(agenda);
  }
}

