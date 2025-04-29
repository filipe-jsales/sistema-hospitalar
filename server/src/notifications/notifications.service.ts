import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { SubcategoriesService } from 'src/subcategories/subcategories.service';
import { ThemesService } from 'src/themes/themes.service';
import { PrioritiesService } from 'src/priorities/priorities.service';
import { IncidentsService } from 'src/incidents/incidents.service';
import { ResponsiblesService } from 'src/responsibles/responsibles.service';
import { OrganizationalUnitiesService } from 'src/organizational-unities/organizational-unities.service';
import { NotifyingServicesService } from 'src/notifying-services/notifying-services.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponseWithGroupings } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

interface GroupedResult {
  description: string;
  count: number;
  name: string;
}
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly categoriesService: CategoriesService,
    private readonly subcategoriesService: SubcategoriesService,
    private readonly themesServices: ThemesService,
    private readonly prioritiesService: PrioritiesService,
    private readonly incidentsService: IncidentsService,
    private readonly responsiblesService: ResponsiblesService,
    private readonly organizationalUnitiesService: OrganizationalUnitiesService,
    private readonly notifyingServicesService: NotifyingServicesService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const category = await this.categoriesService.findOne(
      createNotificationDto.categoryId,
    );
    const subcategory = await this.subcategoriesService.findOne(
      createNotificationDto.subcategoryId,
    );
    const theme = await this.themesServices.findOne(
      createNotificationDto.themeId,
    );
    const priority = await this.prioritiesService.findOne(
      createNotificationDto.priorityId,
    );
    const incident = await this.incidentsService.findOne(
      createNotificationDto.incidentId,
    );
    const responsible = await this.responsiblesService.findOne(
      createNotificationDto.responsibleId,
    );
    const organizationalUnity = await this.organizationalUnitiesService.findOne(
      createNotificationDto.organizationalUnityId,
    );
    const notifyingService = await this.notifyingServicesService.findOne(
      createNotificationDto.notifyingServiceId,
    );

    const maxResult = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('MAX(notification.vigihosp)', 'max')
      .getRawOne();

    const nextVigihosp =
      maxResult && maxResult.max ? Number(maxResult.max) + 1 : 1;

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      category,
      subcategory,
      theme,
      priority,
      incident,
      responsible,
      organizationalUnity,
      notifyingService,
      vigihosp: nextVigihosp,
    });

    return this.notificationRepository.save(notification);
  }

  findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGroupings<Notification>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.notificationRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
        dateField: 'createdAt',
        relations: ['theme', 'incident', 'notifyingService', 'responsible'],
      },
    );

    const getDateConditions = (alias: string) => {
      if (paginationQuery.year) {
        if (paginationQuery.months && paginationQuery.months.length > 0) {
          return paginationQuery.months
            .map((month) => {
              return `EXTRACT(YEAR FROM ${alias}.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM ${alias}.createdAt) = ${month}`;
            })
            .join(' OR ');
        } else {
          return `EXTRACT(YEAR FROM ${alias}.createdAt) = ${paginationQuery.year}`;
        }
      }
      return null;
    };

    const applyResponsibleFilter = (queryBuilder) => {
      if (paginationQuery.responsibleId) {
        queryBuilder.andWhere('notification.responsibleId = :responsibleId', {
          responsibleId: paginationQuery.responsibleId,
        });
      }
      return queryBuilder;
    };

    const applyNotificationIdFilter = (queryBuilder) => {
      if (paginationQuery.notificationId) {
        queryBuilder.andWhere('notification.id = :notificationId', {
          notificationId: paginationQuery.notificationId,
        });
      }
      return queryBuilder;
    };

    const applyThemeIdFilter = (queryBuilder) => {
      if (paginationQuery.themeId) {
        queryBuilder.andWhere('notification.themeId = :themeId', {
          themeId: paginationQuery.themeId,
        });
      }
      return queryBuilder;
    };

    const applyIncidentIdFilter = (queryBuilder) => {
      if (paginationQuery.incidentId) {
        queryBuilder.andWhere('notification.incidentId = :incidentId', {
          incidentId: paginationQuery.incidentId,
        });
      }
      return queryBuilder;
    };

    const applyNotifyingServiceIdFilter = (queryBuilder) => {
      if (paginationQuery.notifyingServiceId) {
        queryBuilder.andWhere(
          'notification.notifyingServiceId = :notifyingServiceId',
          {
            notifyingServiceId: paginationQuery.notifyingServiceId,
          },
        );
      }
      return queryBuilder;
    };

    const applyDeadlineStatusFilter = (queryBuilder) => {
      if (paginationQuery.deadlineStatus) {
        queryBuilder.andWhere('notification.deadlineStatus = :deadlineStatus', {
          deadlineStatus: paginationQuery.deadlineStatus,
        });
      }
      return queryBuilder;
    };

    let descriptionQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.description', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL');

    descriptionQueryBuilder = applyResponsibleFilter(descriptionQueryBuilder);
    descriptionQueryBuilder = applyNotificationIdFilter(
      descriptionQueryBuilder,
    );
    descriptionQueryBuilder = applyThemeIdFilter(descriptionQueryBuilder);
    descriptionQueryBuilder = applyIncidentIdFilter(descriptionQueryBuilder);
    descriptionQueryBuilder = applyNotifyingServiceIdFilter(
      descriptionQueryBuilder,
    );
    descriptionQueryBuilder = applyDeadlineStatusFilter(
      descriptionQueryBuilder,
    );

    const descriptionDateConditions = getDateConditions('notification');
    if (descriptionDateConditions) {
      descriptionQueryBuilder.andWhere(`(${descriptionDateConditions})`);
    }

    const descriptionResults = await descriptionQueryBuilder
      .groupBy('notification.description')
      .getRawMany<GroupedResult>();

    let themeQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.theme', 'theme')
      .select('theme.name', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL');

    themeQueryBuilder = applyResponsibleFilter(themeQueryBuilder);
    themeQueryBuilder = applyNotificationIdFilter(themeQueryBuilder);
    themeQueryBuilder = applyThemeIdFilter(themeQueryBuilder);
    themeQueryBuilder = applyIncidentIdFilter(themeQueryBuilder);
    themeQueryBuilder = applyNotifyingServiceIdFilter(themeQueryBuilder);
    themeQueryBuilder = applyDeadlineStatusFilter(themeQueryBuilder);

    const themeDateConditions = getDateConditions('notification');
    if (themeDateConditions) {
      themeQueryBuilder.andWhere(`(${themeDateConditions})`);
    }

    const themeResults = await themeQueryBuilder
      .groupBy('theme.name')
      .getRawMany<GroupedResult>();

    let incidentQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.incident', 'incident')
      .select('incident.name', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL');

    incidentQueryBuilder = applyResponsibleFilter(incidentQueryBuilder);
    incidentQueryBuilder = applyNotificationIdFilter(incidentQueryBuilder);
    incidentQueryBuilder = applyThemeIdFilter(incidentQueryBuilder);
    incidentQueryBuilder = applyIncidentIdFilter(incidentQueryBuilder);
    incidentQueryBuilder = applyNotifyingServiceIdFilter(incidentQueryBuilder);
    incidentQueryBuilder = applyDeadlineStatusFilter(incidentQueryBuilder);

    const incidentDateConditions = getDateConditions('notification');
    if (incidentDateConditions) {
      incidentQueryBuilder.andWhere(`(${incidentDateConditions})`);
    }

    const incidentResults = await incidentQueryBuilder
      .groupBy('incident.name')
      .getRawMany<GroupedResult>();

    let notifyingServiceQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.notifyingService', 'notifyingService')
      .select('notifyingService.name', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL');

    notifyingServiceQueryBuilder = applyResponsibleFilter(
      notifyingServiceQueryBuilder,
    );
    notifyingServiceQueryBuilder = applyNotificationIdFilter(
      notifyingServiceQueryBuilder,
    );
    notifyingServiceQueryBuilder = applyThemeIdFilter(
      notifyingServiceQueryBuilder,
    );
    notifyingServiceQueryBuilder = applyIncidentIdFilter(
      notifyingServiceQueryBuilder,
    );
    notifyingServiceQueryBuilder = applyNotifyingServiceIdFilter(
      notifyingServiceQueryBuilder,
    );
    notifyingServiceQueryBuilder = applyDeadlineStatusFilter(
      notifyingServiceQueryBuilder,
    );
    const notifyingServiceDateConditions = getDateConditions('notification');
    if (notifyingServiceDateConditions) {
      notifyingServiceQueryBuilder.andWhere(
        `(${notifyingServiceDateConditions})`,
      );
    }

    const notifyingServiceResults = await notifyingServiceQueryBuilder
      .groupBy('notifyingService.name')
      .getRawMany<GroupedResult>();

    let responsibleQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.responsible', 'responsible')
      .select('responsible.name', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL');

    responsibleQueryBuilder = applyResponsibleFilter(responsibleQueryBuilder);
    responsibleQueryBuilder = applyNotificationIdFilter(
      responsibleQueryBuilder,
    );
    responsibleQueryBuilder = applyThemeIdFilter(responsibleQueryBuilder);
    responsibleQueryBuilder = applyIncidentIdFilter(responsibleQueryBuilder);
    responsibleQueryBuilder = applyNotifyingServiceIdFilter(
      responsibleQueryBuilder,
    );
    responsibleQueryBuilder = applyDeadlineStatusFilter(
      responsibleQueryBuilder,
    );

    const responsibleDateConditions = getDateConditions('notification');
    if (responsibleDateConditions) {
      responsibleQueryBuilder.andWhere(`(${responsibleDateConditions})`);
    }

    let deadlineStatusQueryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.deadlineStatus', 'name')
      .addSelect('COUNT(notification.id)', 'count')
      .where('notification.deletedAt IS NULL')
      .andWhere('notification.deadlineStatus IS NOT NULL');

    deadlineStatusQueryBuilder = applyResponsibleFilter(
      deadlineStatusQueryBuilder,
    );
    deadlineStatusQueryBuilder = applyNotificationIdFilter(
      deadlineStatusQueryBuilder,
    );
    deadlineStatusQueryBuilder = applyThemeIdFilter(deadlineStatusQueryBuilder);
    deadlineStatusQueryBuilder = applyIncidentIdFilter(
      deadlineStatusQueryBuilder,
    );
    deadlineStatusQueryBuilder = applyNotifyingServiceIdFilter(
      deadlineStatusQueryBuilder,
    );

    const deadlineStatusDateConditions = getDateConditions('notification');
    if (deadlineStatusDateConditions) {
      deadlineStatusQueryBuilder.andWhere(`(${deadlineStatusDateConditions})`);
    }

    if (paginationQuery.deadlineStatus) {
      deadlineStatusQueryBuilder.andWhere(
        'notification.deadlineStatus = :deadlineStatus',
        {
          deadlineStatus: paginationQuery.deadlineStatus,
        },
      );
    }

    const deadlineStatusResults = await deadlineStatusQueryBuilder
      .groupBy('notification.deadlineStatus')
      .getRawMany<GroupedResult>();

    const processDictionary = (results: GroupedResult[]) => {
      return results.reduce(
        (acc, item) => {
          acc[item.name] = parseInt(item.count as unknown as string, 10);
          return acc;
        },
        {} as { [key: string]: number },
      );
    };

    return {
      ...paginatedData,
      groupedByDescription: processDictionary(descriptionResults),
      groupedByTheme: processDictionary(themeResults),
      groupedByIncident: processDictionary(incidentResults),
      groupedByNotifyingService: processDictionary(notifyingServiceResults),
      groupedByDeadlineStatus: processDictionary(deadlineStatusResults),
    };
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notificação com ${id} não encontrado`);
    }
    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.findOne(id);
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const notification = await this.findOne(id);
    await this.notificationRepository.softRemove(notification);
    return { message: `Notificação com ID ${id} removida` };
  }
}
