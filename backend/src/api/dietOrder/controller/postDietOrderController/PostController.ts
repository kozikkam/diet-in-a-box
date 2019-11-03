import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IValidator } from "../../../../core/validator/IValidator";
import { TYPES } from "../../../../ioc/types";
import { SuccessResponse } from "../../../../response/SuccessResponse";
import { DIET_ORDER_REPOSITORIES } from "../../ioc/DietOrderTypes";
import { IDietOrder } from "../../model/DietOrder";
import { IDietOrderRepository } from "../../repository/IDietOrderRepository";
import { dietOrderPostSchema } from "../../schema/post/postDietOrder";
import { IPostDietOrderController } from "./IPostController";

@injectable()
export class PostDietOrderController implements IPostDietOrderController {

    @inject(DIET_ORDER_REPOSITORIES.IDietOrderRepository)
    private readonly _dietOrderRepository: IDietOrderRepository;

    @inject(TYPES.IValidator)
    private readonly _validator: IValidator;

    public async process(req: Request, res: Response): Promise<Response> {
        this._validator.validate(req.body, dietOrderPostSchema);
        const dietOrder: IDietOrder = await this._dietOrderRepository.insertOne(req.body);

        return res.json(SuccessResponse.Created(dietOrder));
    }
}
