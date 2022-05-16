import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data: T;
}

@Injectable()
export class HttpResponseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        // const request = ctx.getRequest();
        // const url = request.originalUrl;
        const statusCode = response.statusCode;
        const res = {
          statusCode,
          message: null,
          success: true,
          data,
        };
        // console.info(url, res);
        return res;
      })
    );
  }
}
