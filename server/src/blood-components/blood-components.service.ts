import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginatedResponseWithGroupingNested } from 'src/shared/interfaces/paginated-response.dto';
import { BloodComponent } from './entities/blood-component.entity';
import { CreateBloodComponentDto } from './dto/create-blood-component.dto';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';
import { UpdateBloodComponentDto } from './dto/update-blood-component.dto';

interface GroupedResult {
  errorCategory: string;
  count: number;
}

@Injectable()
export class BloodComponentsService {
  constructor(
    @InjectRepository(BloodComponent)
    private bloodComponentRepository: Repository<BloodComponent>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createBloodComponentDto: CreateBloodComponentDto) {
    const bloodComponent = this.bloodComponentRepository.create(
      createBloodComponentDto,
    );
    return this.bloodComponentRepository.save(bloodComponent);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGroupingNested<BloodComponent>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.bloodComponentRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    const groupedCategoryQueryBuilder = this.bloodComponentRepository
      .createQueryBuilder('bloodComponent')
      .select('bloodComponent.errorCategory', 'errorCategory')
      .addSelect('COUNT(bloodComponent.id)', 'count')
      .where('bloodComponent.deletedAt IS NULL');

    const groupedSubcategoryQueryBuilder = this.bloodComponentRepository
      .createQueryBuilder('bloodComponent')
      .select('bloodComponent.errorCategory', 'errorCategory')
      .addSelect('bloodComponent.errorDescription', 'errorDescription')
      .addSelect('COUNT(bloodComponent.id)', 'count')
      .where('bloodComponent.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM bloodComponent.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM bloodComponent.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedCategoryQueryBuilder.andWhere(`(${dateConditions})`);
        groupedSubcategoryQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedCategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM bloodComponent.createdAt) = :year`,
          { year: paginationQuery.year },
        );
        groupedSubcategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM bloodComponent.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    if (paginationQuery.notifyingServiceId) {
      groupedCategoryQueryBuilder.andWhere(
        'bloodComponent.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
      groupedSubcategoryQueryBuilder.andWhere(
        'bloodComponent.notifyingServiceId = :notifyingServiceId',
        { notifyingServiceId: paginationQuery.notifyingServiceId },
      );
    }

    const categoryResults = await groupedCategoryQueryBuilder
      .groupBy('bloodComponent.errorCategory')
      .getRawMany<GroupedResult>();

    const subcategoryResults = await groupedSubcategoryQueryBuilder
      .groupBy('bloodComponent.errorCategory')
      .addGroupBy('bloodComponent.errorDescription')
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
    return this.bloodComponentRepository.find({
      relations: ['notification'],
    });
  }

  async findByNotification(notificationId: number) {
    return this.bloodComponentRepository.find({
      where: { notificationId },
      relations: ['notification'],
    });
  }

  async findOne(id: number) {
    const bloodComponent = await this.bloodComponentRepository.findOne({
      where: { id },
      relations: ['notification'],
    });

    if (!bloodComponent) {
      throw new NotFoundException(
        `Blood Component error with ID ${id} not found`,
      );
    }

    return bloodComponent;
  }

  async update(id: number, updateBloodComponentDto: UpdateBloodComponentDto) {
    const bloodComponent = await this.findOne(id);

    Object.assign(bloodComponent, updateBloodComponentDto);

    return this.bloodComponentRepository.save(bloodComponent);
  }

  async remove(id: number): Promise<{ message: string }> {
    const bloodComponent = await this.findOne(id);
    await this.bloodComponentRepository.softRemove(bloodComponent);
    return { message: `Blood Component error with ID ${id} removed` };
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
