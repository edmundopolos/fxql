import { Test, TestingModule } from '@nestjs/testing';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forex } from './fxql.entity';

describe('FxqlController', () => {
  let controller: FxqlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxqlController],
      providers: [FxqlService],
      imports:[TypeOrmModule.forFeature([Forex])]
    }).compile();

    controller = module.get<FxqlController>(FxqlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
