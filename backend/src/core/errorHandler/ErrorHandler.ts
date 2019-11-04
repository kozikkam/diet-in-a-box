import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/types";
import { ErrorResponse } from "../../response/ErrorResponse";
import { ILogger } from "../logger/ILogger";
import { IErrorHandler } from "./IErrorHandler";
import { ValidationError } from "../error/ValidationError";

@injectable()
export class ErrorHandler implements IErrorHandler {
  
  @inject(TYPES.ILogger)
  private readonly _logger: ILogger;

  public handle(): (error: Error, req: Request, res: Response, next: NextFunction) => any {
    return (error: Error, req: Request, res: Response, next: NextFunction): any => {
      if (!error) {
        return next();
      }

      if (error instanceof ValidationError) {
        return res.status(400).json(ErrorResponse.BadRequest(error.message));
      }
  
      this._logger.error(error.message);
  
      return res.status(500).json(ErrorResponse.Internal());
    };
  }
}
