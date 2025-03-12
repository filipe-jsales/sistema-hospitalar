import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { name, description, userDescription, action, subject, roles } =
      createPermissionDto;
    const roleEntities = roles
      ? await this.roleRepository.findBy({ id: In(roles) })
      : [];

    if (roles && roleEntities.length !== roles.length) {
      throw new NotFoundException(
        'Um ou mais roles fornecidos não foram encontrados.',
      );
    }

    const newPermission = this.permissionRepository.create({
      name,
      description,
      userDescription,
      action,
      subject,
      roles: roleEntities,
    });

    return this.permissionRepository.save(newPermission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permissão com ID ${id} não foi encontrada.`);
    }

    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const { roles, ...updateData } = updatePermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permissão com ID ${id} não foi encontrada.`);
    }

    if (roles) {
      const roleEntities = await this.roleRepository.findBy({ id: In(roles) });
      if (roleEntities.length !== roles.length) {
        throw new NotFoundException(
          'Um ou mais roles fornecidos não foram encontrados.',
        );
      }
      permission.roles = roleEntities;
    }

    Object.assign(permission, updateData);

    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permissão com ID ${id} não foi encontrada.`);
    }
    return { message: `Permissão com o id ${id} foi removido com sucesso.` };
  }
}
