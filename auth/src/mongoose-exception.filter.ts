import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Mongoose validation error 잡기
    if (exception.name === 'ValidationError') {
      return response.status(400).json({
        statusCode: 400,
        message: exception.message,
      });
    }

    // // 기본 예외처리
    // response.status(500).json({
    //   statusCode: 500,
    //   message: 'Internal server error',
    // });
  }
}
