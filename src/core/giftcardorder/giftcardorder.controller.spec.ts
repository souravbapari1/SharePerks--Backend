import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardorderController } from './giftcardorder.controller';
import { GiftcardorderService } from './giftcardorder.service';

describe('GiftcardorderController', () => {
  let controller: GiftcardorderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftcardorderController],
      providers: [GiftcardorderService],
    }).compile();

    controller = module.get<GiftcardorderController>(GiftcardorderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
