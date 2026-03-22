import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export interface TasksQuery {
    projectId?: string;
    page?: number;
    limit?: number;
}
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTaskDto): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        assigneeId: string | null;
        title: string;
        status: string;
        priority: string;
        projectId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(query?: TasksQuery): Promise<{
        data: Task[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        assigneeId: string | null;
        title: string;
        status: string;
        priority: string;
        projectId: string;
    }>;
    update(id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        assigneeId: string | null;
        title: string;
        status: string;
        priority: string;
        projectId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
