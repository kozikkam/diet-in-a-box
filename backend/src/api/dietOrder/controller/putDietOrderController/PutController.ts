import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAuthenticator } from "../../../../core/auth/IAuthenticator";
import { IValidator } from "../../../../core/validator/IValidator";
import { TYPES } from "../../../../ioc/types";
import { ErrorResponse } from "../../../../response/ErrorResponse";
import { SuccessResponse } from "../../../../response/SuccessResponse";
import { DIET_ORDER_REPOSITORIES } from "../../ioc/DietOrderTypes";
import { IDietOrder } from "../../model/DietOrder";
import { IDietOrderRepository } from "../../repository/IDietOrderRepository";
import { dietOrderPutSchema } from "../../schema/put/putDietOrder";
import { IPutDietOrderController } from "./IPutController";

@injectable()
export class PutDietOrderController implements IPutDietOrderController {

    @inject(TYPES.IAuthenticator)
    private readonly _authenticator: IAuthenticator;

    @inject(DIET_ORDER_REPOSITORIES.IDietOrderRepository)
    private readonly _dietOrderRepository: IDietOrderRepository;

    @inject(TYPES.IValidator)
    private readonly _validator: IValidator;

    public async process(req: Request, res: Response): Promise<Response> {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, dietOrderPutSchema);
      const dietOrderToModify: IDietOrder = await this._dietOrderRepository.getOne(
        { _id: req.params.id }
      );
      if (dietOrderToModify) {
        const updated = await this._dietOrderRepository.updateOneById(
          req.params.id,
          { $set: { status: req.body.status } }
        );
        return res.json(SuccessResponse.Ok(updated));
      }
      return res.json(ErrorResponse.BadRequest());
    }
}
