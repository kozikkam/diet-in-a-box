import { NextFunction, Request, Response } from "express";

export interface IErrorHandler {
    handle(): (error: Error, req: Request, res: Response, next: NextFunction) => any;
}
