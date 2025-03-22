import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { User } from '../users/entities/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/casl/casl-ability.factory/action.enum';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalsRepository: Repository<Hospital>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  create(createHospitalDto: CreateHospitalDto, user: User) {
    return this.hospitalsRepository.create(createHospitalDto);
  }

  async findAll(user: User) {
    const ability = this.caslAbilityFactory.createForUser(user);

    const canReadAllHospitals = ability.can(Action.Manage, Hospital);
    if (canReadAllHospitals) {
      return this.hospitalsRepository.find();
    }
    if (user.hospital) {
      const hospital = await this.hospitalsRepository.findOne({
        where: { id: user.hospital.id },
      });

      if (!hospital) {
        throw new NotFoundException(`Hospital vinculado não encontrado`);
      }

      if (ability.can(Action.Read, hospital)) {
        return [hospital];
      }
    }

    throw new ForbiddenException(
      'Você não tem permissão para listar hospitais',
    );
  }

  async findOne(id: number, user: User) {
    const hospital = await this.hospitalsRepository.findOne({
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    if (
      ability.can(Action.Manage, Hospital) ||
      (user.hospital && user.hospital.id === hospital.id)
    ) {
      return hospital;
    }
    throw new ForbiddenException(
      'Você não tem permissão para ver este hospital',
    );
  }

  async update(id: number, updateHospitalDto: UpdateHospitalDto, user: User) {
    const hospital = await this.hospitalsRepository.findOne({
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    if (
      ability.can(Action.Manage, Hospital) ||
      (user.hospital &&
        user.hospital.id === hospital.id &&
        ability.can(Action.Update, hospital))
    ) {
      Object.assign(hospital, updateHospitalDto);
      return this.hospitalsRepository.save(hospital);
    }

    throw new ForbiddenException(
      'Você não tem permissão para atualizar este hospital',
    );
  }

  async remove(id: number, user: User) {
    const hospital = await this.hospitalsRepository.findOne({
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.Manage, Hospital)) {
      await this.hospitalsRepository.remove(hospital);
      return { message: `Hospital com ID ${id} foi removido com sucesso` };
    }

    throw new ForbiddenException(
      'Você não tem permissão para remover este hospital',
    );
  }
}
