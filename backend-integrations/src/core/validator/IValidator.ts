import { Request } from "express";
import Joi from "@hapi/joi";

export interface IValidator {
    validate(req: Request, schema: Joi.Schema): boolean;
}
