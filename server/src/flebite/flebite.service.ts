import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginatedResponseWithGroupingNested } from 'src/shared/interfaces/paginated-response.dto';
import { Flebite } from './entities/flebite.entity';
import { CreateFlebiteDto } from './dto/create-flebite.dto';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { UpdateFlebiteDto } from './dto/update-flebite.dto';

interface GroupedResult {
  errorCategory: string;
  count: number;
}
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

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGroupingNested<Flebite>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.flebiteRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    const groupedCategoryQueryBuilder = this.flebiteRepository
      .createQueryBuilder('flebite')
      .select('flebite.errorCategory', 'errorCategory')
      .addSelect('COUNT(flebite.id)', 'count')
      .where('flebite.deletedAt IS NULL');

    const groupedSubcategoryQueryBuilder = this.flebiteRepository
      .createQueryBuilder('flebite')
      .select('flebite.errorCategory', 'errorCategory')
      .addSelect('flebite.errorDescription', 'errorDescription')
      .addSelect('COUNT(flebite.id)', 'count')
      .where('flebite.deletedAt IS NULL');

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

        groupedCategoryQueryBuilder.andWhere(`(${dateConditions})`, parameters);
        groupedSubcategoryQueryBuilder.andWhere(
          `(${dateConditions})`,
          parameters,
        );
      } else {
        groupedCategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM flebite.createdAt) = :year`,
          { year: paginationQuery.year },
        );
        groupedSubcategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM flebite.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    if (paginationQuery.notifyingServiceId) {
      groupedCategoryQueryBuilder.andWhere(
        'flebite.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
      groupedSubcategoryQueryBuilder.andWhere(
        'flebite.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
    }

    const categoryResults = await groupedCategoryQueryBuilder
      .groupBy('flebite.errorCategory')
      .getRawMany<GroupedResult>();

    const subcategoryResults = await groupedSubcategoryQueryBuilder
      .groupBy('flebite.errorCategory')
      .addGroupBy('flebite.errorDescription')
      .getRawMany<{
        errorCategory: string;
        errorDescription: string;
        count: number;
      }>();

    const groupedData = categoryResults.reduce(
      (acc, item) => {
        acc[item.errorCategory] = {
          total: parseInt(item.count as unknown as string, 10),
          descriptions: {},
        };

        subcategoryResults
          .filter((sub) => sub.errorCategory === item.errorCategory)
          .forEach((sub) => {
            if (sub.errorDescription) {
              acc[item.errorCategory].descriptions[sub.errorDescription] =
                parseInt(sub.count as unknown as string, 10);
            }
          });

        return acc;
      },
      {} as {
        [category: string]: {
          total: number;
          descriptions: { [description: string]: number };
        };
      },
    );

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
