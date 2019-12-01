import { NextFunction, Request, Response } from "express";
import { Container } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces
} from "inversify-express-utils";
import { IDatabase } from "../../core/database/IDatabase";
import { TYPES } from "../../ioc/types";
import { IGetDietOrderController } from "./controller/getDietOrderController/IGetController";
import { IPostDietOrderController } from "./controller/postDietOrderController/IPostController";
import { IPutDietOrderController } from "./controller/putDietOrderController/IPutController";
import { DIET_ORDER_TYPES } from "./ioc/DietOrderTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";

const config: Config = new Config();
const ENDPOINT: string = "diet-orders";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class DietOrderController implements interfaces.Controller {
  private readonly _container: Container = getContainer();

  private readonly postDietOrderController: IPostDietOrderController = this._container.get(
    DIET_ORDER_TYPES.IPostDietOrderController
  );
  private readonly getDietOrderController: IGetDietOrderController = this._container.get(
    DIET_ORDER_TYPES.IGetDietOrderController
  );
  private readonly updateDietOrderController: IPutDietOrderController = this._container.get(
    DIET_ORDER_TYPES.IPutDietOrderController
  );

  @httpGet("/")
  public async getDietOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return this.getDietOrderController.process.bind(
      this.getDietOrderController
    )(req, res, next);
  }

  @httpPost("/")
  public async postDietOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return this.postDietOrderController.process.bind(
      this.postDietOrderController
    )(req, res, next);
  }

  @httpPut("/")
  public async updateDietOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return this.updateDietOrderController.process.bind(
      this.updateDietOrderController
    )(req, res, next);
  }
}
