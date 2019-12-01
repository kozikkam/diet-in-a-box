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
import { DietRepository } from "../repository/DietRepository";
import { IDietRepository } from "../repository/IDietRepository";
import { DIET_REPOSITORIES, DIET_TYPES } from "./DietTypes";
import { DietService } from "../service/DietService";

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
    .bind<IDietRepository>(DIET_REPOSITORIES.IDietRepository)
    .to(DietRepository);

  container
    .bind<IAuthenticator>(TYPES.IAuthenticator)
    .to(Authenticator)
    .inSingletonScope();

  container
    .bind<DietService>(DIET_TYPES.IDietService)
    .to(DietService)
    .inSingletonScope();

  return container;
};

export default getContainer;
