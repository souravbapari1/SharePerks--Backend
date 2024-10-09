import { Test, TestingModule } from '@nestjs/testing';
import { AppcontentController } from './appcontent.controller';

describe('AppcontentController', () => {
  let controller: AppcontentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppcontentController],
    }).compile();

    controller = module.get<AppcontentController>(AppcontentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
