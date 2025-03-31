import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Responsible } from './entities/responsible.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResponsiblesService {
  constructor(
    @InjectRepository(Responsible)
    private readonly responsiblesRepository: Repository<Responsible>,
  ) {}
  create(createResponsibleDto: CreateResponsibleDto): Promise<Responsible> {
    return this.responsiblesRepository.save(createResponsibleDto);
  }

  findAll(): Promise<Responsible[]> {
    return this.responsiblesRepository.find();
  }

  async findOne(id: number): Promise<Responsible> {
    const responsible = await this.responsiblesRepository.findOne({
      where: { id },
    });
    if (!responsible) {
      throw new NotFoundException(`Responsável com ID ${id} não encontrado`);
    }
    return responsible;
  }

  async update(
    id: number,
    updateResponsibleDto: UpdateResponsibleDto,
  ): Promise<Responsible> {
    await this.findOne(id);
    await this.responsiblesRepository.update(id, updateResponsibleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    const responsible = await this.responsiblesRepository.findOne({
      where: { id },
    });
    await this.responsiblesRepository.softRemove(responsible);
    return { message: `Usuário com ID ${id} removido.` };
  }
}
