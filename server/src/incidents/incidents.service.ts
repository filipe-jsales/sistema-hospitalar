import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponseWithGrouping } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

interface GroupedResult {
  name: string;
  count: number;
}

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
  ): Promise<PaginatedResponseWithGrouping<Incident>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.incidentRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );

    const groupedResults = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.name', 'name')
      .addSelect('COUNT(incident.id)', 'count')
      .where('incident.deletedAt IS NULL')
      .groupBy('incident.name')
      .getRawMany<GroupedResult>();

    const groupedData = groupedResults.reduce(
      (acc, item) => {
        acc[item.name] = parseInt(item.count as unknown as string, 10);
        return acc;
      },
      {} as { [key: string]: number },
    );

    return {
      ...paginatedData,
      groupedData,
    };
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
