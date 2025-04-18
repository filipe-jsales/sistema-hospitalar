import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepository: Repository<Priority>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createPriorityDto: CreatePriorityDto): Promise<Priority> {
    return this.priorityRepository.save(createPriorityDto);
  }

  findAll(): Promise<Priority[]> {
    return this.priorityRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Priority>> {
    return this.paginationService.paginateRepository(
      this.priorityRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
  }

  async findOne(id: number): Promise<Priority> {
    const priority = await this.priorityRepository.findOne({ where: { id } });
    if (!priority) {
      throw new NotFoundException(`Prioridade de ID ${id} não encontrada`);
    }
    return priority;
  }

  async update(
    id: number,
    updatePriorityDto: UpdatePriorityDto,
  ): Promise<Priority> {
    await this.findOne(id);
    await this.priorityRepository.update(id, updatePriorityDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const priority = await this.findOne(id);
    await this.priorityRepository.softRemove(priority);
    return { message: `Prioridade de ID ${id} removida` };
  }
}
