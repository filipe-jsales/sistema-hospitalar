import { Injectable } from '@nestjs/common';
import { CreateOrganizationalUnityDto } from './dto/create-organizational-unity.dto';
import { UpdateOrganizationalUnityDto } from './dto/update-organizational-unity.dto';

@Injectable()
export class OrganizationalUnitiesService {
  create(createOrganizationalUnityDto: CreateOrganizationalUnityDto) {
    return 'This action adds a new organizationalUnity';
  }

  findAll() {
    return `This action returns all organizationalUnities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationalUnity`;
  }

  update(id: number, updateOrganizationalUnityDto: UpdateOrganizationalUnityDto) {
    return `This action updates a #${id} organizationalUnity`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationalUnity`;
  }
}
