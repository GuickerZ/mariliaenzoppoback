import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../helpers/Errors/ApiError";

export const ExpressAsyncErrors = (error: Error & ApiError, request: Request, response: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    message: error.message
  });
}