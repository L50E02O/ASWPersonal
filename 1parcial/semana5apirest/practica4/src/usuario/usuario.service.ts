import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(dto);
    return await this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id_usuario: id });
    if (!usuario) throw new NotFoundException('No se encontró el usuario con el id proporcionado');
    return usuario;
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    Object.assign(usuario, dto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
