import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
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
    findAll(projectId?: string, page?: string, limit?: string): Promise<{
        data: import(".prisma/client").Task[];
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
