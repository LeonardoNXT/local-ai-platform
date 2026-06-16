import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(statusCode).json({
        success: false,
        statusCode,
        path: request.url,
        timestamp: new Date().toISOString(),
        error:
          typeof exceptionResponse === "string"
            ? {
                message: exceptionResponse,
              }
            : exceptionResponse,
      });
    }

    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: {
        name: "InternalServerError",
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error.",
      },
    });
  }
}
