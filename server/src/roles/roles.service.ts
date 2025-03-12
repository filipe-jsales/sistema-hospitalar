import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: RoleDto): Promise<Role> {
    const { name, permissions } = createRoleDto;
    console.log(name, permissions);

    const permissionsEntities = permissions
      ? await this.permissionRepository.findBy({ id: In(permissions) })
      : [];

    if (permissions && permissionsEntities.length !== permissions.length) {
      throw new NotFoundException('Alguma permissão não foi encontrada.');
    }

    const newRole = this.roleRepository.create({
      name,
      permissions: permissionsEntities,
    });

    return this.roleRepository.save(newRole);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['users', 'permissions'],
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users', 'permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role com o id ${id} não foi encontrado.`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name, users, permissions } = updateRoleDto;
    console.log(name, users, permissions);
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users', 'permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role com o ${id} não foi encontrado.`);
    }
    if (name !== undefined) {
      role.name = name;
    }
    if (users) {
      role.users = await this.userRepository.findBy({ id: In(users) });
    }

    if (permissions) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(permissions),
      });
    }

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role com o id ${id} não foi encontrado.`);
    }
    return { message: `Role com o id ${id} foi removido com sucesso.` };
  }
}
