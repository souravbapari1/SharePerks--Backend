import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardorderService } from './giftcardorder.service';

describe('GiftcardorderService', () => {
  let service: GiftcardorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftcardorderService],
    }).compile();

    service = module.get<GiftcardorderService>(GiftcardorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
