import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),

    update: jest.fn((id, dto) => ({ id, ...dto })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { name: 'sami' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });

    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', () => {
    const dto = { name: 'Sami' };

    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUserService.update).toHaveBeenCalled();
  });
});
