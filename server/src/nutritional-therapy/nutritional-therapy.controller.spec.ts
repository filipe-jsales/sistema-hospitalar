import { Test, TestingModule } from '@nestjs/testing';
import { NutritionalTherapyController } from './nutritional-therapy.controller';
import { NutritionalTherapyService } from './nutritional-therapy.service';

describe('NutritionalTherapyController', () => {
  let controller: NutritionalTherapyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionalTherapyController],
      providers: [NutritionalTherapyService],
    }).compile();

    controller = module.get<NutritionalTherapyController>(
      NutritionalTherapyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
