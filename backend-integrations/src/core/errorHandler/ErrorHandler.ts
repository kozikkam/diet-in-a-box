import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/types";
import { ErrorResponse } from "../../response/ErrorResponse";
import { AuthenticationError } from "../error/AuthenticationError";
import { ValidationError } from "../error/ValidationError";
import { ILogger } from "../logger/ILogger";
import { IErrorHandler } from "./IErrorHandler";
import { BadRequestError } from "../error/BadRequestError";

@injectable()
export class ErrorHandler implements IErrorHandler {
  @inject(TYPES.ILogger)
  private readonly _logger: ILogger;

  public handle(): (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => any {
    return (
      error: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ): any => {
      if (!error) {
        return next();
      }

      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorResponse.BadRequest(error.message));
      }

      if (error instanceof AuthenticationError) {
        return res
          .status(403)
          .json(ErrorResponse.Unauthorized(error.message || "Unauthorized"));
      }

      if (error instanceof BadRequestError) {
        return res
          .status(403)
          .json(ErrorResponse.BadRequest(error.message || "Bad request"));
      }

      this._logger.error(error.message);

      return res.status(500).json(ErrorResponse.Internal());
    };
  }
}
