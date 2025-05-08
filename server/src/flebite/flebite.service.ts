import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { Flebite } from './entities/flebite.entity';
import { CreateFlebiteDto } from './dto/create-flebite.dto';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { UpdateFlebiteDto } from './dto/update-flebite.dto';

@Injectable()
export class FlebiteService {
  constructor(
    @InjectRepository(Flebite)
    private flebiteRepository: Repository<Flebite>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createFlebiteDto: CreateFlebiteDto) {
    const flebite = this.flebiteRepository.create(createFlebiteDto);
    return this.flebiteRepository.save(flebite);
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<
    PaginatedResponse<Flebite> & {
      groupedData: {
        riskLevel: { [key: string]: { total: number } };
        classification: { [key: string]: { total: number } };
      };
    }
  > {
    const paginatedData = await this.paginationService.paginateRepository(
      this.flebiteRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    // Consulta para agrupar por nível de risco
    const groupedRiskLevelQueryBuilder = this.flebiteRepository
      .createQueryBuilder('flebite')
      .select('flebite.riskLevel', 'riskLevel')
      .addSelect('COUNT(flebite.id)', 'count')
      .where('flebite.deletedAt IS NULL');

    // Consulta para agrupar por classificação
    const groupedClassificationQueryBuilder = this.flebiteRepository
      .createQueryBuilder('flebite')
      .select('flebite.classification', 'classification')
      .addSelect('COUNT(flebite.id)', 'count')
      .where('flebite.deletedAt IS NULL');

    // Aplicar filtros de data para ambas as consultas
    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month, index) => {
            return `(EXTRACT(YEAR FROM flebite.createdAt) = :year AND EXTRACT(MONTH FROM flebite.createdAt) = :month${index})`;
          })
          .join(' OR ');

        const parameters = paginationQuery.months.reduce(
          (acc, month, index) => {
            acc[`month${index}`] = month;
            return acc;
          },
          { year: paginationQuery.year },
        );

        groupedRiskLevelQueryBuilder.andWhere(
          `(${dateConditions})`,
          parameters,
        );
        groupedClassificationQueryBuilder.andWhere(
          `(${dateConditions})`,
          parameters,
        );
      } else {
        groupedRiskLevelQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM flebite.createdAt) = :year`,
          { year: paginationQuery.year },
        );
        groupedClassificationQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM flebite.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    // Aplicar filtro por serviço notificante para ambas as consultas
    if (paginationQuery.notifyingServiceId) {
      groupedRiskLevelQueryBuilder.andWhere(
        'flebite.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
      groupedClassificationQueryBuilder.andWhere(
        'flebite.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
    }

    // Executar as consultas agrupadas
    const riskLevelResults = await groupedRiskLevelQueryBuilder
      .groupBy('flebite.riskLevel')
      .getRawMany<{ riskLevel: string; count: number }>();

    const classificationResults = await groupedClassificationQueryBuilder
      .groupBy('flebite.classification')
      .getRawMany<{ classification: string; count: number }>();

    // Estruturar os dados agrupados no formato desejado
    const groupedData = {
      riskLevel: riskLevelResults.reduce(
        (acc, item) => {
          if (item.riskLevel) {
            acc[item.riskLevel] = {
              total: parseInt(item.count as unknown as string, 10),
            };
          }
          return acc;
        },
        {} as { [key: string]: { total: number } },
      ),
      classification: classificationResults.reduce(
        (acc, item) => {
          if (item.classification) {
            acc[item.classification] = {
              total: parseInt(item.count as unknown as string, 10),
            };
          }
          return acc;
        },
        {} as { [key: string]: { total: number } },
      ),
    };

    return {
      ...paginatedData,
      groupedData,
    };
  }

  async findAll() {
    return this.flebiteRepository.find({
      relations: ['notification'],
    });
  }

  async findByNotification(notificationId: number) {
    return this.flebiteRepository.find({
      where: { notificationId },
      relations: ['notification'],
    });
  }

  async findOne(id: number) {
    const flebite = await this.flebiteRepository.findOne({
      where: { id },
      relations: ['notification'],
    });

    if (!flebite) {
      throw new NotFoundException(`Flebite error with ID ${id} not found`);
    }

    return flebite;
  }

  async update(id: number, updateFlebiteDto: UpdateFlebiteDto) {
    const flebite = await this.findOne(id);

    Object.assign(flebite, updateFlebiteDto);

    return this.flebiteRepository.save(flebite);
  }

  async remove(id: number): Promise<{ message: string }> {
    const flebite = await this.findOne(id);
    await this.flebiteRepository.softRemove(flebite);
    return { message: `Flebite error with ID ${id} removed` };
  }

  getErrorCategories() {
    return Object.values(ErrorCategory).map((value) => ({
      value,
      name: value,
    }));
  }

  getErrorDescriptions() {
    return Object.values(ErrorDescription).map((value) => ({
      value,
      name: value,
    }));
  }
}
