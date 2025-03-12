import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(request.body);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string | any = 'Internal server error';
    let errorDetails: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // Get the response from the HttpException (could be a string or an object)
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        // If there’s a message array (from validation errors, for example), use it.
        errorMessage = (res as any).message || exception.message;
        // Spread additional details if available.
        errorDetails = { ...res };
      } else {
        errorMessage = res;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    // Optionally log the full exception or its stack trace for debugging
    console.error(exception instanceof Error ? exception.stack : exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      // Include additional details if they exist
      ...(Object.keys(errorDetails).length > 0 && { errorDetails }),
    });
  }
}
