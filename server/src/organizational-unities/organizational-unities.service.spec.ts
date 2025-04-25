import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitiesService } from './organizational-unities.service';

describe('OrganizationalUnitiesService', () => {
  let service: OrganizationalUnitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationalUnitiesService],
    }).compile();

    service = module.get<OrganizationalUnitiesService>(
      OrganizationalUnitiesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
