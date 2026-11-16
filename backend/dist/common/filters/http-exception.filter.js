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
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode;
        let message;
        let error;
        let details;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                error = common_1.HttpStatus[statusCode] || 'Error';
            }
            else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                message = String(responseObj.message || 'An error occurred');
                error = String(responseObj.error || common_1.HttpStatus[statusCode] || 'Error');
                details = responseObj.details;
            }
            else {
                message = 'An error occurred';
                error = common_1.HttpStatus[statusCode] || 'Error';
            }
        }
        else {
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            error = 'Internal Server Error';
            if (exception instanceof Error) {
                this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
            }
            else {
                this.logger.error('Unknown exception:', exception);
            }
        }
        const errorResponse = {
            success: false,
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(details && { details }),
        };
        this.logger.error(`${request.method} ${request.url} - ${statusCode}: ${message}`, exception instanceof Error ? exception.stack : undefined);
        response.status(statusCode).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map