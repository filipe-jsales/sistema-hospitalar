import { Test, TestingModule } from '@nestjs/testing';
import { BloodComponentsController } from './blood-components.controller';
import { BloodComponentsService } from './blood-components.service';

describe('BloodComponentsController', () => {
  let controller: BloodComponentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodComponentsController],
      providers: [BloodComponentsService],
    }).compile();

    controller = module.get<BloodComponentsController>(
      BloodComponentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
