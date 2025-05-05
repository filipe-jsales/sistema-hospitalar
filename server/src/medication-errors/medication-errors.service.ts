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
import { PaginatedResponseWithGrouping } from 'src/shared/interfaces/paginated-response.dto';

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
  ): Promise<PaginatedResponseWithGrouping<MedicationError>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.medicationErrorRepository,
      paginationQuery,
      {
        relations: ['notification'],
        order: { createdAt: 'DESC' },
        dateField: 'createdAt',
      },
    );

    const groupedQueryBuilder = this.medicationErrorRepository
      .createQueryBuilder('medicationError')
      .select('medicationError.errorCategory', 'errorCategory')
      .addSelect('COUNT(medicationError.id)', 'count')
      .where('medicationError.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM medicationError.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM medicationError.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM medicationError.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    const groupedResults = await groupedQueryBuilder
      .groupBy('medicationError.errorCategory')
      .getRawMany<GroupedResult>();

    const groupedData = groupedResults.reduce(
      (acc, item) => {
        acc[item.errorCategory] = parseInt(item.count as unknown as string, 10);
        return acc;
      },
      {} as { [key: string]: number },
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
