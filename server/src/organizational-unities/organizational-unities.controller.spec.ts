import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitiesController } from './organizational-unities.controller';
import { OrganizationalUnitiesService } from './organizational-unities.service';

describe('OrganizationalUnitiesController', () => {
  let controller: OrganizationalUnitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalUnitiesController],
      providers: [OrganizationalUnitiesService],
    }).compile();

    controller = module.get<OrganizationalUnitiesController>(OrganizationalUnitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
