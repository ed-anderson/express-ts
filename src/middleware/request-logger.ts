import { NextFunction, Request, Response } from 'express';

export function requestLoggerMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  console.log(`${request.method} ${request.path}`);
  next();
}
