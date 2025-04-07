import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    return this.incidentRepository.save(createIncidentDto);
  }

  findAll(): Promise<Incident[]> {
    return this.incidentRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Incident>> {
    return this.paginationService.paginateRepository(
      this.incidentRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
  }

  async findOne(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incidente com ID ${id} não encontrado`);
    }
    return incident;
  }

  async update(
    id: number,
    updateIncidentDto: UpdateIncidentDto,
  ): Promise<Incident> {
    await this.findOne(id);
    await this.incidentRepository.update(id, updateIncidentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const incident = await this.findOne(id);
    await this.incidentRepository.softRemove(incident);
    return { message: `Incidente com ID ${id} removido` };
  }
}
