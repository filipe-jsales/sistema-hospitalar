import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginatedResponseWithGroupingNested } from 'src/shared/interfaces/paginated-response.dto';
import { NutritionalTherapy } from './entities/nutritional-therapy.entity';
import { CreateNutritionalTherapyDto } from './dto/create-nutritional-therapy.dto';
import { UpdateNutritionalTherapyDto } from './dto/update-nutritional-therapy.dto';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';

interface GroupedResult {
  errorCategory: string;
  count: number;
}

@Injectable()
export class NutritionalTherapyService {
  constructor(
    @InjectRepository(NutritionalTherapy)
    private nutritionalTherapyRepository: Repository<NutritionalTherapy>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createNutritionalTherapyDto: CreateNutritionalTherapyDto) {
    const nutritionalTherapy = this.nutritionalTherapyRepository.create(
      createNutritionalTherapyDto,
    );
    return this.nutritionalTherapyRepository.save(nutritionalTherapy);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGroupingNested<NutritionalTherapy>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.nutritionalTherapyRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    const groupedCategoryQueryBuilder = this.nutritionalTherapyRepository
      .createQueryBuilder('nutritionalTherapy')
      .select('nutritionalTherapy.errorCategory', 'errorCategory')
      .addSelect('COUNT(nutritionalTherapy.id)', 'count')
      .where('nutritionalTherapy.deletedAt IS NULL');

    const groupedSubcategoryQueryBuilder = this.nutritionalTherapyRepository
      .createQueryBuilder('nutritionalTherapy')
      .select('nutritionalTherapy.errorCategory', 'errorCategory')
      .addSelect('nutritionalTherapy.errorDescription', 'errorDescription')
      .addSelect('COUNT(nutritionalTherapy.id)', 'count')
      .where('nutritionalTherapy.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM nutritionalTherapy.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM nutritionalTherapy.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedCategoryQueryBuilder.andWhere(`(${dateConditions})`);
        groupedSubcategoryQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedCategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM nutritionalTherapy.createdAt) = :year`,
          { year: paginationQuery.year },
        );
        groupedSubcategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM nutritionalTherapy.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    if (paginationQuery.notifyingServiceId) {
      groupedCategoryQueryBuilder.andWhere(
        'nutritionalTherapy.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
      groupedSubcategoryQueryBuilder.andWhere(
        'nutritionalTherapy.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
    }

    const categoryResults = await groupedCategoryQueryBuilder
      .groupBy('nutritionalTherapy.errorCategory')
      .getRawMany<GroupedResult>();

    const subcategoryResults = await groupedSubcategoryQueryBuilder
      .groupBy('nutritionalTherapy.errorCategory')
      .addGroupBy('nutritionalTherapy.errorDescription')
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
    return this.nutritionalTherapyRepository.find({
      relations: ['notification'],
    });
  }

  async findByNotification(notificationId: number) {
    return this.nutritionalTherapyRepository.find({
      where: { notificationId },
      relations: ['notification'],
    });
  }

  async findOne(id: number) {
    const nutritionalTherapy = await this.nutritionalTherapyRepository.findOne({
      where: { id },
      relations: ['notification'],
    });

    if (!nutritionalTherapy) {
      throw new NotFoundException(
        `Nutritional Therapy error with ID ${id} not found`,
      );
    }

    return nutritionalTherapy;
  }

  async update(
    id: number,
    updateNutritionalTherapyDto: UpdateNutritionalTherapyDto,
  ) {
    const nutritionalTherapy = await this.findOne(id);

    Object.assign(nutritionalTherapy, updateNutritionalTherapyDto);

    return this.nutritionalTherapyRepository.save(nutritionalTherapy);
  }

  async remove(id: number): Promise<{ message: string }> {
    const nutritionalTherapy = await this.findOne(id);
    await this.nutritionalTherapyRepository.softRemove(nutritionalTherapy);
    return { message: `Nutritional Therapy error with ID ${id} removed` };
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
