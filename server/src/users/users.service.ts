import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/entities/role.entity';
import { HospitalsService } from 'src/hospitals/hospitals.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @Inject(forwardRef(() => HospitalsService))
    private readonly hospitalsService: HospitalsService,
  ) {}

  private buildUserQueryOptions(currentUser: User) {
    const isSuperAdmin = currentUser.roles?.some(
      (role) => role.name === 'superadmin',
    );

    const isAdmin = currentUser.roles?.some((role) => role.name === 'admin');

    const queryOptions: any = {
      relations: ['roles', 'roles.permissions', 'hospital'],
    };

    if (isSuperAdmin) {
      return queryOptions;
    }
    if (isAdmin && currentUser.hospital) {
      queryOptions.where = {
        hospital: { id: currentUser.hospital.id },
      };
      return queryOptions;
    }
    throw new ForbiddenException(
      'Você não tem permissão para realizar esta ação.',
    );
  }

  //TODO: admin só pode criar um usuário para o mesmo hospital que está associado
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

  async findAll(currentUser: User): Promise<User[]> {
    const queryOptions = this.buildUserQueryOptions(currentUser);
    return this.usersRepository.find(queryOptions);
  }

  async findOneUnauthenticated(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'hospital'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async findOne(id: number, currentUser: User): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'hospital'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    const isSuperAdmin = currentUser.roles?.some(
      (role) => role.name === 'superadmin',
    );

    const isAdmin = currentUser.roles?.some((role) => role.name === 'admin');
    if (isSuperAdmin) {
      return user;
    }
    if (isAdmin && currentUser.hospital?.id === user.hospital?.id) {
      return user;
    }
    if (currentUser.id === user.id) {
      return user;
    }

    throw new ForbiddenException(
      'Você não tem permissão para realizar esta ação neste usuário.',
    );
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
    currentUser: User,
  ): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id, currentUser);
    return user;
  }

  async addRoleToUser(
    userId: number,
    roleId: number,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(userId, currentUser);
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

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }

  //somente superadmin pode dar assign 
  async assignHospitalToUser(
    userId: number,
    hospitalId: number,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(userId, currentUser);
    const hospital = await this.hospitalsService.findOne(
      hospitalId,
      currentUser,
    );

    user.hospital = hospital;
    return this.usersRepository.save(user);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const userData = await this.findOne(id, currentUser);
    await this.usersRepository.softRemove(userData);
  }
}
