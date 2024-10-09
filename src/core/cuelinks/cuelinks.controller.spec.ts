import { Test, TestingModule } from '@nestjs/testing';
import { CuelinksController } from './cuelinks.controller';

describe('CuelinksController', () => {
  let controller: CuelinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuelinksController],
    }).compile();

    controller = module.get<CuelinksController>(CuelinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
