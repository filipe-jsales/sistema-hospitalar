import { Injectable } from '@nestjs/common';
import { CreateNotifyingServiceDto } from './dto/create-notifying-service.dto';
import { UpdateNotifyingServiceDto } from './dto/update-notifying-service.dto';

@Injectable()
export class NotifyingServicesService {
  create(createNotifyingServiceDto: CreateNotifyingServiceDto) {
    return 'This action adds a new notifyingService';
  }

  findAll() {
    return `This action returns all notifyingServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notifyingService`;
  }

  update(id: number, updateNotifyingServiceDto: UpdateNotifyingServiceDto) {
    return `This action updates a #${id} notifyingService`;
  }

  remove(id: number) {
    return `This action removes a #${id} notifyingService`;
  }
}
