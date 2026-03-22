"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, message } = this.resolveError(exception);
        this.logger.error(`${request.method} ${request.url} - ${status}: ${message}`, exception instanceof Error ? exception.stack : undefined);
        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    resolveError(exception) {
        if (exception instanceof common_1.HttpException) {
            const res = exception.getResponse();
            const message = typeof res === 'string'
                ? res
                : (res.message?.toString() ??
                    exception.message);
            return { status: exception.getStatus(), message };
        }
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            return this.resolvePrismaError(exception);
        }
        if (exception instanceof Error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
        };
    }
    resolvePrismaError(error) {
        switch (error.code) {
            case 'P2025':
                return { status: common_1.HttpStatus.NOT_FOUND, message: 'Record not found' };
            case 'P2002': {
                const fields = error.meta?.target?.join(', ');
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: fields
                        ? `Unique constraint violation on: ${fields}`
                        : 'Unique constraint violation',
                };
            }
            case 'P2003':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Foreign key constraint failed',
                };
            case 'P2014':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Relation constraint violated',
                };
            default:
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database error',
                };
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map