import { Resolver, Query, Args, ID } from "@nestjs/graphql";
import { UsuarioType } from "../types/usuario.type";
import { RestClientService } from "../rest-client/rest-client.service";

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(private readonly restClient: RestClientService) {}

  @Query(() => [UsuarioType], { name: "usuarios" })
  async getUsuarios(): Promise<UsuarioType[]> {
    const usuarios = await this.restClient.getUsuarios();
    return usuarios.map((usuario) => this.transformarUsuario(usuario));
  }

  @Query(() => UsuarioType, { name: "usuario", nullable: true })
  async getUsuarioById(@Args("id", { type: () => ID }) id: string): Promise<UsuarioType | null> {
    try {
      const usuario = await this.restClient.getUsuarioById(id);
      return this.transformarUsuario(usuario);
    } catch (error) {
      return null;
    }
  }

  @Query(() => UsuarioType, { name: "usuarioPorEmail", nullable: true })
  async getUsuarioByEmail(@Args("correo") correo: string): Promise<UsuarioType | null> {
    try {
      const usuario = await this.restClient.getUsuarioByEmail(correo);
      return this.transformarUsuario(usuario);
    } catch (error) {
      return null;
    }
  }

  private transformarUsuario(usuario: any): UsuarioType {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      fechaRegistro: new Date(usuario.fechaRegistro),
      conferencias: usuario.conferencias?.map((c: any) => this.transformarConferencia(c)),
      agendas: usuario.agendas?.map((a: any) => this.transformarAgenda(a)),
      totalConferencias: usuario.conferencias?.length || 0,
      totalAgendas: usuario.agendas?.length || 0,
    };
  }

  private transformarConferencia(conferencia: any): any {
    return {
      ...conferencia,
      fechaInicio: new Date(conferencia.fechaInicio),
      fechaFin: new Date(conferencia.fechaFin),
    };
  }

  private transformarAgenda(agenda: any): any {
    return {
      ...agenda,
      fechaAgendada: new Date(agenda.fechaAgendada),
      fechaCreacion: new Date(agenda.fechaCreacion),
    };
  }
}

