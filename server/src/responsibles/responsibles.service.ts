import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Responsible } from './entities/responsible.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class ResponsiblesService {
  constructor(
    @InjectRepository(Responsible)
    private readonly responsiblesRepository: Repository<Responsible>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createResponsibleDto: CreateResponsibleDto): Promise<Responsible> {
    return this.responsiblesRepository.save(createResponsibleDto);
  }

  findAll(): Promise<Responsible[]> {
    return this.responsiblesRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Responsible>> {
    return this.paginationService.paginateRepository(
      this.responsiblesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
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
