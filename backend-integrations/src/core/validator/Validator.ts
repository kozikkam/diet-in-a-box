import { injectable } from "inversify";
import Joi, { ValidationResult } from "@hapi/joi";
import { ValidationError } from "../error/ValidationError";
import { IValidator } from "./IValidator";

@injectable()
export class Validator implements IValidator {
  public validate(body: object, schema: Joi.Schema): boolean {
    const result: ValidationResult = schema.validate(body);

    if (result.error || result.errors) {
      throw new ValidationError(result.error.message);
    }

    return true;
  }
}
