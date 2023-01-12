import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersModule } from './../src/users/users.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/entities/user.entity';
import { response } from 'express';
import { userInfo } from 'os';

describe('UserController (e2e)', () => {
  let user: INestApplication;

  const mockUsers = [{ id: 1, name: 'Sami' }];
  const mockUserRepository = {
    find: jest.fn().mockResolvedValue({ mockUsers }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...userInfo }),
      ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    user = moduleFixture.createNestApplication();
    await user.init();
  });

  it('/users (GET)', () => {
    return request(user.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(mockUsers);
  });

  it('/users {POST}', () => {
    return request(user.getHttpServer())
      .get('users')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Abile',
        });
      });
  });
});
