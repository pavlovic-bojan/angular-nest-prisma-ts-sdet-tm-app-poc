/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Task Manager API (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let projectId: string;
  let userId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.enableCors();
    const config = new DocumentBuilder()
      .setTitle('Task Manager API')
      .setVersion('1.0')
      .build();
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
    await app.init();

    // Obtain JWT token for all protected endpoints
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'demo@example.com', password: 'password123' });
    authToken = loginRes.body.access_token as string;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health & Swagger', () => {
    it('GET / returns health check', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('GET /api-json returns Swagger OpenAPI doc', () => {
      return request(app.getHttpServer())
        .get('/api-json')
        .expect(200)
        .expect((res) => expect(res.body.info?.title).toBe('Task Manager API'));
    });
  });

  describe('Auth', () => {
    it('POST /auth/login - invalid credentials returns 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpass' })
        .expect(401);
    });

    it('POST /auth/login - valid credentials returns access_token and user without password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'demo@example.com', password: 'password123' })
        .expect(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user).toHaveProperty('email', 'demo@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('GET /users without token returns 401', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('Users', () => {
    it('GET /users returns array', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /users creates user without exposing password', async () => {
      const email = `e2e-${Date.now()}@test.com`;
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'E2E User',
          email,
          password: 'secret123',
          role: 'developer',
        })
        .expect(201);
      expect(res.body).toHaveProperty('email', email);
      expect(res.body).not.toHaveProperty('password');
      userId = res.body.id as string;
    });

    it('GET /users/:id returns user', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('PUT /users/:id updates user', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'E2E Updated' })
        .expect(200);
      expect(res.body.name).toBe('E2E Updated');
    });

    it('GET /users/non-existent-id returns 404', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('DELETE /users/:id removes user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Projects', () => {
    it('GET /projects returns array', async () => {
      const res = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /projects creates project', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'E2E Project', description: 'Test' })
        .expect(201);
      expect(res.body.name).toBe('E2E Project');
      projectId = res.body.id as string;
    });

    it('GET /projects/:id returns project', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('PUT /projects/:id updates project', async () => {
      const res = await request(app.getHttpServer())
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'E2E Updated Project' })
        .expect(200);
      expect(res.body.name).toBe('E2E Updated Project');
    });

    it('GET /projects/non-existent-id returns 404', () => {
      return request(app.getHttpServer())
        .get('/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Tasks', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: `Task Test Project ${Date.now()}` });
      projectId = res.body.id as string;
    });

    it('GET /tasks returns paginated result', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('total');
    });

    it('POST /tasks creates task', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'E2E Task',
          description: 'Test',
          projectId,
          status: 'todo',
          priority: 'medium',
        })
        .expect(201);
      expect(res.body.title).toBe('E2E Task');
      taskId = res.body.id as string;
    });

    it('GET /tasks?projectId filters by project', async () => {
      const res = await request(app.getHttpServer())
        .get(`/tasks?projectId=${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /tasks/:id returns task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('PUT /tasks/:id updates task', async () => {
      const res = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'E2E Updated Task', status: 'in-progress' })
        .expect(200);
      expect(res.body.title).toBe('E2E Updated Task');
    });

    it('DELETE /tasks/:id removes task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('GET /tasks/non-existent-id returns 404', () => {
      return request(app.getHttpServer())
        .get('/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
