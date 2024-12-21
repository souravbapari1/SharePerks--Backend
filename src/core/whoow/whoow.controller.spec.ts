import { Test, TestingModule } from '@nestjs/testing';
import { WhoowController } from './whoow.controller';
import { WhoowService } from './whoow.service';

describe('WhoowController', () => {
  let controller: WhoowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhoowController],
      providers: [WhoowService],
    }).compile();

    controller = module.get<WhoowController>(WhoowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
