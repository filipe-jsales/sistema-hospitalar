import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationErrorDto } from './dto/create-medication-error.dto';
import { UpdateMedicationErrorDto } from './dto/update-medication-error.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationError } from './entities/medication-error.entity';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { ErrorCategory } from './enums/error-category.enum';
import { ErrorDescription } from './enums/error-description.enum';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginatedResponseWithGroupingNested } from 'src/shared/interfaces/paginated-response.dto';

interface GroupedResult {
  errorCategory: string;
  count: number;
}

@Injectable()
export class MedicationErrorsService {
  constructor(
    @InjectRepository(MedicationError)
    private medicationErrorRepository: Repository<MedicationError>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createMedicationErrorDto: CreateMedicationErrorDto) {
    const medicationError = this.medicationErrorRepository.create(
      createMedicationErrorDto,
    );
    return this.medicationErrorRepository.save(medicationError);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGroupingNested<MedicationError>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.medicationErrorRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    // Primeiro agrupamento: contar por categoria
    const groupedCategoryQueryBuilder = this.medicationErrorRepository
      .createQueryBuilder('medicationError')
      .select('medicationError.errorCategory', 'errorCategory')
      .addSelect('COUNT(medicationError.id)', 'count')
      .where('medicationError.deletedAt IS NULL');

    // Segundo agrupamento: contar por categoria e descrição
    const groupedSubcategoryQueryBuilder = this.medicationErrorRepository
      .createQueryBuilder('medicationError')
      .select('medicationError.errorCategory', 'errorCategory')
      .addSelect('medicationError.errorDescription', 'errorDescription')
      .addSelect('COUNT(medicationError.id)', 'count')
      .where('medicationError.deletedAt IS NULL');

    // Aplicar filtros de data para ambas as consultas
    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM medicationError.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM medicationError.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedCategoryQueryBuilder.andWhere(`(${dateConditions})`);
        groupedSubcategoryQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedCategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM medicationError.createdAt) = :year`,
          { year: paginationQuery.year },
        );
        groupedSubcategoryQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM medicationError.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    const categoryResults = await groupedCategoryQueryBuilder
      .groupBy('medicationError.errorCategory')
      .getRawMany<GroupedResult>();

    const subcategoryResults = await groupedSubcategoryQueryBuilder
      .groupBy('medicationError.errorCategory')
      .addGroupBy('medicationError.errorDescription')
      .getRawMany<{
        errorCategory: string;
        errorDescription: string;
        count: number;
      }>();

    // Organizar dados por categoria e subcategoria
    const groupedData = categoryResults.reduce(
      (acc, item) => {
        // Inicializar a categoria com o total
        acc[item.errorCategory] = {
          total: parseInt(item.count as unknown as string, 10),
          descriptions: {},
        };

        // Adicionar subcategorias (descrições) a cada categoria
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
    return this.medicationErrorRepository.find({
      relations: ['notification'],
    });
  }

  async findByNotification(notificationId: number) {
    return this.medicationErrorRepository.find({
      where: { notificationId },
      relations: ['notification'],
    });
  }

  async findOne(id: number) {
    const medicationError = await this.medicationErrorRepository.findOne({
      where: { id },
      relations: ['notification'],
    });

    if (!medicationError) {
      throw new NotFoundException(`Medication error with ID ${id} not found`);
    }

    return medicationError;
  }

  async update(id: number, updateMedicationErrorDto: UpdateMedicationErrorDto) {
    const medicationError = await this.findOne(id);

    Object.assign(medicationError, updateMedicationErrorDto);

    return this.medicationErrorRepository.save(medicationError);
  }

  async remove(id: number): Promise<{ message: string }> {
    const medicationError = await this.findOne(id);
    await this.medicationErrorRepository.softRemove(medicationError);
    return { message: `Medication error with ID ${id} removed` };
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
