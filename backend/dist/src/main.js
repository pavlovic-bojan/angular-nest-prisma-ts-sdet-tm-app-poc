"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = new common_1.Logger('Bootstrap');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const rawOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:4200';
    const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());
    app.enableCors({ origin: allowedOrigins, credentials: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Task Manager API')
        .setDescription('API for Angular Task Manager — Users, Projects, Tasks')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication')
        .addTag('users', 'User management')
        .addTag('projects', 'Project management')
        .addTag('tasks', 'Task management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    logger.log('Swagger UI available at /api');
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application running on port ${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map