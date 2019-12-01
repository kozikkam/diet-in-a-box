import { NextFunction, Request, Response } from "express";
import { Container, inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces
} from "inversify-express-utils";
import { IDatabase } from "../../core/database/IDatabase";
import { TYPES } from "../../ioc/types";
import { DIET_TYPES } from "./ioc/DietTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";
import { IDiet } from "./model/Diet";
import { SuccessResponse } from "../../response/SuccessResponse";
import { IDietService } from "./service/IDietService";
import { dietPostSchema } from "./schema/post/postDiet";
import { IAuthenticator } from "../../core/auth/IAuthenticator";
import { IValidator } from "../../core/validator/IValidator";
import { dietPutSchema } from "./schema/put/putDiet";

const config: Config = new Config();
const ENDPOINT: string = "diets";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class DietController implements interfaces.Controller {
  private readonly _container: Container = getContainer();
  private readonly _dietService: IDietService = this._container.get<
    IDietService
  >(DIET_TYPES.IDietService);

  @inject(TYPES.IAuthenticator)
  private readonly _authenticator: IAuthenticator;

  @inject(TYPES.IValidator)
  private readonly _validator: IValidator;

  @httpGet("/")
  public async getDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const diets: IDiet[] = await this._dietService.getDiets();
      return res.json(SuccessResponse.Ok(diets));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpGet("/:dietId")
  public async getDietById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const diet: IDiet = await this._dietService.getDietById(
        req.params.dietId
      );
      return res.json(SuccessResponse.Ok(diet));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpPost("/")
  public async postDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, dietPostSchema);
      const diet: IDiet = await this._dietService.postDiet(req.body);
      return res.json(SuccessResponse.Created(diet));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpPut("/")
  public async updateDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, dietPutSchema);
      const updatedDiet: IDiet = await this._dietService.putDiet(
        req.query.id,
        req.body
      );
      return res.json(SuccessResponse.Ok(updatedDiet));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }
}
