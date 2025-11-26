import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { CrearUsuarioDto, ActualizarUsuarioDto } from "../../../dominio/dto";

@Controller("usuarios")
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuarioService.create(crearUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usuarioService.findOne(id);
  }

  @Get("email/:correo")
  findByEmail(@Param("correo") correo: string) {
    return this.usuarioService.findByEmail(correo);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto) {
    return this.usuarioService.update(id, actualizarUsuarioDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.usuarioService.remove(id);
  }
}

