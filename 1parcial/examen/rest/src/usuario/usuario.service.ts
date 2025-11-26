import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Usuario } from "../../../dominio/entities";
import { CrearUsuarioDto, ActualizarUsuarioDto } from "../../../dominio/dto";

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly httpService: HttpService
  ) {}

  async create(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(crearUsuarioDto);
    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    // Llamar al webhook después de crear
    await this.llamarWebhook(usuarioGuardado.id, "CREATE", usuarioGuardado);

    return usuarioGuardado;
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ["conferencias", "agendas"],
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ["conferencias", "agendas"],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { correo },
      relations: ["conferencias", "agendas"],
    });
  }

  async update(id: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, actualizarUsuarioDto);
    const usuarioActualizado = await this.usuarioRepository.save(usuario);

    // Llamar al webhook después de actualizar
    await this.llamarWebhook(usuarioActualizado.id, "UPDATE", usuarioActualizado);

    return usuarioActualizado;
  }

  private async llamarWebhook(id: string, tipoOperacion: "CREATE" | "UPDATE", datos: any): Promise<void> {
    try {
      const payload = {
        id,
        tipoOperacion,
        datos,
      };

      await firstValueFrom(
        this.httpService.post(`http://localhost:3000/webhook/usuarios`, payload)
      );
      this.logger.log(`Webhook llamado para usuario ${id} - ${tipoOperacion}`);
    } catch (error) {
      this.logger.error(`Error al llamar webhook para usuario ${id}:`, error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}

