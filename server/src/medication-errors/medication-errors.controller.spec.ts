import { Test, TestingModule } from '@nestjs/testing';
import { MedicationErrorsController } from './medication-errors.controller';
import { MedicationErrorsService } from './medication-errors.service';

describe('MedicationErrorsController', () => {
  let controller: MedicationErrorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationErrorsController],
      providers: [MedicationErrorsService],
    }).compile();

    controller = module.get<MedicationErrorsController>(
      MedicationErrorsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
