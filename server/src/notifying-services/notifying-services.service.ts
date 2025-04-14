import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotifyingServiceDto } from './dto/create-notifying-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifyingService } from './entities/notifying-service.entity';
import { Repository } from 'typeorm';
import { UpdateNotifyingServiceDto } from './dto/update-notifying-service.dto';
import { PaginatedResponseWithGrouping } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

interface GroupedResult {
  name: string;
  count: number;
}

@Injectable()
export class NotifyingServicesService {
  constructor(
    @InjectRepository(NotifyingService)
    private readonly notifyingServicesRepository: Repository<NotifyingService>,
    private readonly paginationService: PaginationService,
  ) {}

  create(
    createNotifyingServiceDto: CreateNotifyingServiceDto,
  ): Promise<NotifyingService> {
    return this.notifyingServicesRepository.save(createNotifyingServiceDto);
  }

  findAll(): Promise<NotifyingService[]> {
    return this.notifyingServicesRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGrouping<NotifyingService>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.notifyingServicesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
        dateField: 'createdAt',
      },
    );

    let groupedQueryBuilder = await this.notifyingServicesRepository
      .createQueryBuilder('service')
      .select('service.name', 'name')
      .addSelect('COUNT(service.id)', 'count')
      .where('service.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM service.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM service.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM service.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    const groupedResults = await groupedQueryBuilder
      .groupBy('service.name')
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

  async findOne(id: number): Promise<NotifyingService> {
    const notifyingService = await this.notifyingServicesRepository.findOne({
      where: { id },
    });

    if (!notifyingService) {
      throw new NotFoundException(`NotifyingService with ID ${id} not found`);
    }

    return notifyingService;
  }

  async update(
    id: number,
    updateNotifyingServiceDto: UpdateNotifyingServiceDto,
  ): Promise<NotifyingService> {
    await this.findOne(id);
    await this.notifyingServicesRepository.update(
      id,
      updateNotifyingServiceDto,
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const notifyingService = await this.findOne(id);
    await this.notifyingServicesRepository.softRemove(notifyingService);
    return { message: `Serviço notificante ${id} removido com sucesso` };
  }
}
