import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';

const mockProject = {
  id: '1',
  name: 'P1',
  description: 'Desc',
  createdAt: new Date(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create project', async () => {
    mockPrisma.project.create.mockResolvedValue(mockProject);
    const result = await service.create({ name: 'P1', description: 'Desc' });
    expect(result.name).toBe('P1');
  });

  it('should throw NotFoundException when project not found', async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should findAll projects', async () => {
    mockPrisma.project.findMany.mockResolvedValue([mockProject]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should update project', async () => {
    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.update.mockResolvedValue({
      ...mockProject,
      name: 'Updated',
    });
    const result = await service.update('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should throw NotFoundException on update when project not found', async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);
    await expect(service.update('invalid', { name: 'X' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove project', async () => {
    mockPrisma.project.findUnique.mockResolvedValue(mockProject);
    mockPrisma.project.delete.mockResolvedValue({} as never);
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'Project deleted' });
  });
});
