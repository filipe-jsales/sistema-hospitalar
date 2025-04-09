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
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

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
    });

    return this.notificationRepository.save(notification);
  }

  findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Notification>> {
    return this.paginationService.paginateRepository(
      this.notificationRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
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
