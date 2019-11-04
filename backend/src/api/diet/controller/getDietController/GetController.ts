import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SuccessResponse } from "../../../../response/SuccessResponse";
import { DIET_ORDER_REPOSITORIES } from "../../ioc/DietTypes";
import { IDiet } from "../../model/Diet";
import { IDietRepository } from "../../repository/IDietRepository";
import { IGetDietController } from "./IGetController";

@injectable()
export class GetDietController implements IGetDietController {
  
  @inject(DIET_ORDER_REPOSITORIES.IDietRepository)
  private readonly _dietRepository: IDietRepository;

  public async process(req: Request, res: Response): Promise<Response> {
    const users: IDiet[] = await this._dietRepository.getMany();

    return res.json(SuccessResponse.Ok(users));
  }
}
