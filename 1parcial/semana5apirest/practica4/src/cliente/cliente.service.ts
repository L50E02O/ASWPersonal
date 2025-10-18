import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async findAll() {
    return await this.clienteRepository.find();
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOneBy({ id_cliente: id });
    if (!cliente) {
      throw new NotFoundException('No se encontro el cliente con el id proporcionado');
    }
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOneBy({ id_cliente: id });
    if (!cliente) {
      throw new NotFoundException('No se encontro el cliente con el id proporcionado');
    }
    await this.clienteRepository.update(id, updateClienteDto);
    return this.clienteRepository.findOneBy({ id_cliente: id });
  }

  async remove(id: string) {
    const cliente = await this.clienteRepository.findOneBy({ id_cliente: id });
    if (!cliente) {
      throw new NotFoundException('No se encontro el cliente con el id proporcionado');
    }
    await this.clienteRepository.remove(cliente);
    return { message: 'Cliente eliminado correctamente' };
  }
}
