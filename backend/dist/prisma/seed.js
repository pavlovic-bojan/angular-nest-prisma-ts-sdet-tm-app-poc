"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const BCRYPT_ROUNDS = 10;
async function main() {
    const demoUser = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: {
            name: "Demo User",
            email: "demo@example.com",
            password: await bcrypt.hash("password123", BCRYPT_ROUNDS),
            role: "admin",
        },
    });
    await prisma.user.upsert({
        where: { email: "jane@example.com" },
        update: {},
        create: {
            name: "Jane Doe",
            email: "jane@example.com",
            password: await bcrypt.hash("changeme", BCRYPT_ROUNDS),
            role: "developer",
        },
    });
    await prisma.user.upsert({
        where: { email: "john@example.com" },
        update: {},
        create: {
            name: "John Smith",
            email: "john@example.com",
            password: await bcrypt.hash("changeme", BCRYPT_ROUNDS),
            role: "developer",
        },
    });
    const project1 = (await prisma.project.findFirst({ where: { name: "Angular Task Manager" } })) ??
        (await prisma.project.create({
            data: {
                name: "Angular Task Manager",
                description: "Main project for task management app",
            },
        }));
    const project2 = (await prisma.project.findFirst({ where: { name: "Side Project" } })) ??
        (await prisma.project.create({
            data: {
                name: "Side Project",
                description: "Personal side project",
            },
        }));
    void project2;
    const existingTasks = await prisma.task.count();
    if (existingTasks === 0) {
        await prisma.task.createMany({
            data: [
                {
                    title: "Setup project",
                    description: "Initialize Angular project with Tailwind",
                    status: "done",
                    priority: "high",
                    projectId: project1.id,
                    assigneeId: demoUser.id,
                },
                {
                    title: "Implement auth",
                    description: "Add login/logout with JWT and bcrypt",
                    status: "in-progress",
                    priority: "high",
                    projectId: project1.id,
                    assigneeId: demoUser.id,
                },
                {
                    title: "Create task list",
                    description: "Build task CRUD functionality",
                    status: "todo",
                    priority: "medium",
                    projectId: project1.id,
                },
            ],
        });
    }
    console.log("Seed completed successfully");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map