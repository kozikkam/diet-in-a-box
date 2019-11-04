import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IValidator } from "../../../../core/validator/IValidator";
import { TYPES } from "../../../../ioc/types";
import { ErrorResponse } from "../../../../response/ErrorResponse";
import { SuccessResponse } from "../../../../response/SuccessResponse";
import { DIET_ORDER_REPOSITORIES } from "../../ioc/DietTypes";
import { IDiet } from "../../model/Diet";
import { IDietRepository } from "../../repository/IDietRepository";
import { dietPutSchema } from "../../schema/put/putDiet";
import { IPutDietController } from "./IPutController";

@injectable()
export class PutDietController implements IPutDietController {

  @inject(DIET_ORDER_REPOSITORIES.IDietRepository)
  private readonly _dietRepository: IDietRepository;

  @inject(TYPES.IValidator)
  private readonly _validator: IValidator;

  public async process(req: Request, res: Response): Promise<Response> {
    this._validator.validate(req.body, dietPutSchema);
    const dietToModify: IDiet = await this._dietRepository.getOne({
      _id: req.query.id
    });
    if (dietToModify) {
      const { name, dailyCost } = req.body;
      const updated: IDiet = await this._dietRepository.updateOneById(req.query.id, {
        $set: { name, dailyCost }
      });
      return res.json(SuccessResponse.Ok(updated));
    }
    return res.json(ErrorResponse.BadRequest());
  }
}
