import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const defaultRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });

    if (!defaultRole) {
      console.warn('Role "user" não encontrada. Criando role padrão...');
      const newRole = this.rolesRepository.create({ name: 'user' });
      await this.rolesRepository.save(newRole);
    }

    const user = this.usersRepository.create({
      ...userData,
      roles: [defaultRole],
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    return user;
  }

  async addRoleToUser(userId: number, roleId: number): Promise<User> {
    const user = await this.findOne(userId);
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role com ID ${roleId} não encontrada.`);
    }
    const hasRole = user.roles.some((r) => r.id === role.id);

    if (!hasRole) {
      user.roles.push(role);
      await this.usersRepository.save(user);
    }

    return user;
  }

  async remove(id: number): Promise<void> {
    const userData = await this.findOne(id);
    await this.usersRepository.softRemove(userData);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
