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
import { DAILY_DIET_TYPES } from "./ioc/DailyDietTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";
import { IDailyDiet } from "./model/DailyDiet";
import { SuccessResponse } from "../../response/SuccessResponse";
import { IDailyDietService } from "./service/IDailyDietService";
import { dailyDietPostSchema } from "./schema/post/postDailyDiet";
import { IAuthenticator } from "../../core/auth/IAuthenticator";
import { IValidator } from "../../core/validator/IValidator";
import { dailyDietPutSchema } from "./schema/put/putDailyDiet";
import { BadRequestError } from "../../core/error/BadRequestError";

const config: Config = new Config();
const ENDPOINT: string = "daily-diets";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class DailyDietController implements interfaces.Controller {
  private readonly _container: Container = getContainer();
  private readonly _dailyDietService: IDailyDietService = this._container.get<
    IDailyDietService
  >(DAILY_DIET_TYPES.IDailyDietService);

  @inject(TYPES.IAuthenticator)
  private readonly _authenticator: IAuthenticator;

  @inject(TYPES.IValidator)
  private readonly _validator: IValidator;

  @httpGet("/")
  public async getDailyDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const dailyDiets: IDailyDiet[] = await this._dailyDietService.getDailyDiets(
        req.query.date,
        req.query.dietId
      );
      return res.json(SuccessResponse.Ok(dailyDiets));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpGet("/:dailyDietId")
  public async getDailyDietById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const dailyDiet: IDailyDiet = await this._dailyDietService.getDailyDietById(
        req.params.dailyDietId
      );
      if (dailyDiet) {
        return res.json(SuccessResponse.Ok(dailyDiet));
      }
      throw new BadRequestError("Daily diet with given id does not exist");
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpPost("/")
  public async postDailyDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, dailyDietPostSchema);
      const dailyDiet: IDailyDiet = await this._dailyDietService.postDailyDiet(
        req.body
      );
      return res.json(SuccessResponse.Created(dailyDiet));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpPut("/:dailyDietId")
  public async updateDailyDiet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, dailyDietPutSchema);
      const updatedDailyDiet: IDailyDiet = await this._dailyDietService.putDailyDiet(
        req.params.dailyDietId,
        req.body
      );
      return res.json(SuccessResponse.Ok(updatedDailyDiet));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }
}
