import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { Config } from "../../../config/Config";
import { IConfig } from "../../../config/IConfig";
import { Authenticator } from "../../../core/auth/Authenticator";
import { IAuthenticator } from "../../../core/auth/IAuthenticator";
import database from "../../../core/database/Database";
import { IDatabase } from "../../../core/database/IDatabase";
import { ILogger } from "../../../core/logger/ILogger";
import { Logger } from "../../../core/logger/Logger";
import { IValidator } from "../../../core/validator/IValidator";
import { Validator } from "../../../core/validator/Validator";
import { TYPES } from "../../../ioc/types";
import { DailyDietRepository } from "../repository/DailyDietRepository";
import { IDailyDietRepository } from "../repository/IDailyDietRepository";
import { DAILY_DIET_REPOSITORIES, DAILY_DIET_TYPES } from "./DailyDietTypes";
import { DailyDietService } from "../service/DailyDietService";
import { IDietRepository } from "../../diet/repository/IDietRepository";
import { DIET_REPOSITORIES } from "../../diet/ioc/DietTypes";
import { DietRepository } from "../../diet/repository/DietRepository";
import { IMealRepository } from "../../meal/repository/IMealRepository";
import { MEAL_REPOSITORIES } from "../../meal/ioc/MealTypes";
import { MealRepository } from "../../meal/repository/MealRepository";

const getContainer: () => Container = (): Container => {
  const container: Container = new Container();
  container
    .bind<IConfig>(TYPES.IConfig)
    .to(Config)
    .inSingletonScope();

  container
    .bind<IValidator>(TYPES.IValidator)
    .to(Validator)
    .inSingletonScope();

  container
    .bind<ILogger>(TYPES.ILogger)
    .to(Logger)
    .inSingletonScope();

  container
    .bind<interfaces.Factory<IDatabase>>(TYPES.IDatabase)
    .toFactory<IDatabase>(() => {
      return () => {
        return database(
          container.get<IConfig>(TYPES.IConfig),
          container.get<ILogger>(TYPES.ILogger)) as IDatabase;
      };
    });

  container
    .bind<IDailyDietRepository>(DAILY_DIET_REPOSITORIES.IDailyDietRepository)
    .to(DailyDietRepository);

  container
    .bind<IAuthenticator>(TYPES.IAuthenticator)
    .to(Authenticator)
    .inSingletonScope();

  container
    .bind<DailyDietService>(DAILY_DIET_TYPES.IDailyDietService)
    .to(DailyDietService)
    .inSingletonScope();

  container
    .bind<IDietRepository>(DIET_REPOSITORIES.IDietRepository)
    .to(DietRepository);

  container
    .bind<IMealRepository>(MEAL_REPOSITORIES.IMealRepository)
    .to(MealRepository);

  return container;
};

export default getContainer;
