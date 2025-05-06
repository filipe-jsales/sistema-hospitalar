import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponseWithGrouping } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

interface GroupedResult {
  name: string;
  count: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGrouping<Category>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.categoriesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
        dateField: 'createdAt',
      },
    );

    const groupedQueryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .select('category.name', 'name')
      .addSelect('COUNT(category.id)', 'count')
      .where('category.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM category.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM category.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM category.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    const groupedResults = await groupedQueryBuilder
      .groupBy('category.name')
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoriesRepository.softRemove(category);
    return { message: `Category ${id} removed` };
  }
}
