import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login and return access_token + user', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.login({
      email: 'demo@example.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('mock.jwt.token');
    expect(result.user.email).toBe('demo@example.com');
    expect(result.user).not.toHaveProperty('password');
  });

  it('should throw UnauthorizedException when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'wrong@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    const hashedPassword = await bcrypt.hash('correct', 10);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'demo@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    await expect(
      service.login({ email: 'demo@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
