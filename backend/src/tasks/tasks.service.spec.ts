import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

const mockTask = {
  id: '1',
  title: 'T1',
  projectId: 'p1',
  status: 'todo',
  priority: 'medium',
};

describe('TasksService', () => {
  let service: TasksService;

  const mockPrisma = {
    task: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create task with defaults', async () => {
    mockPrisma.task.create.mockResolvedValue(mockTask);
    const result = await service.create({ title: 'T1', projectId: 'p1' });
    expect(result.title).toBe('T1');
    expect(mockPrisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'todo',
          priority: 'medium',
        }) as unknown,
      }),
    );
  });

  it('should findAll and return paginated result', async () => {
    mockPrisma.$transaction.mockResolvedValue([[mockTask], 1]);
    const result = await service.findAll();
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
  });

  it('should findAll filtered by projectId', async () => {
    mockPrisma.$transaction.mockResolvedValue([[], 0]);
    await service.findAll({ projectId: 'proj-1' });
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('should throw NotFoundException when task not found', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update task', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(mockTask);
    mockPrisma.task.update.mockResolvedValue({ ...mockTask, title: 'Updated' });
    const result = await service.update('1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should throw NotFoundException on update when task not found', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);
    await expect(service.update('invalid', { title: 'X' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove task', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(mockTask);
    mockPrisma.task.delete.mockResolvedValue(mockTask);
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'Task deleted' });
  });
});
