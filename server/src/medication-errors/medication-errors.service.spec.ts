import { Test, TestingModule } from '@nestjs/testing';
import { MedicationErrorsService } from './medication-errors.service';

describe('MedicationErrorsService', () => {
  let service: MedicationErrorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationErrorsService],
    }).compile();

    service = module.get<MedicationErrorsService>(MedicationErrorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
