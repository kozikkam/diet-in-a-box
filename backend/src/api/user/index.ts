import { NextFunction, Request, Response } from "express";
import { Container } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  interfaces
} from "inversify-express-utils";
import { IDatabase } from "../../core/database/IDatabase";
import { TYPES } from "../../ioc/types";
import { IGetUserController } from "./controller/getUserController/IGetController";
import { IPostUserController } from "./controller/postUserController/IPostController";
import { USER_TYPES } from "./ioc/UserTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";

const config: Config = new Config();
const ENDPOINT: string = "users";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class UserController implements interfaces.Controller {
  private readonly _container: Container = getContainer();

  private readonly postUserController: IPostUserController = this._container.get(
    USER_TYPES.IPostUserController
  );
  private readonly getUserController: IGetUserController = this._container.get(
    USER_TYPES.IGetUserController
  );

  @httpGet("/")
  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return this.getUserController.process.bind(this.getUserController)(
      req,
      res,
      next
    );
  }

  @httpPost("/")
  public async postUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return this.postUserController.process.bind(this.postUserController)(
      req,
      res,
      next
    );
  }
}
