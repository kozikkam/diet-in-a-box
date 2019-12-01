import "reflect-metadata";

import fs from "fs";
import { Container, interfaces } from "inversify";
import path from "path";
import { Config } from "../config/Config";
import { IConfig } from "../config/IConfig";
import { Authenticator } from "../core/auth/Authenticator";
import { IAuthenticator } from "../core/auth/IAuthenticator";
import database from "../core/database/Database";
import { IDatabase } from "../core/database/IDatabase";
import { ErrorHandler } from "../core/errorHandler/ErrorHandler";
import { IErrorHandler } from "../core/errorHandler/IErrorHandler";
import { ILogger } from "../core/logger/ILogger";
import { Logger } from "../core/logger/Logger";
import { IValidator } from "../core/validator/IValidator";
import { Validator } from "../core/validator/Validator";
import { TYPES } from "./types";

import "../api/auth/";
import "../api/dailyDiet/";
import "../api/diet/";
import "../api/dietOrder/";
import "../api/meal/";
import "../api/product/";
import "../api/user/";

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
    .bind<IErrorHandler>(TYPES.IErrorHandler)
    .to(ErrorHandler)
    .inSingletonScope();

  container
    .bind<IAuthenticator>(TYPES.IAuthenticator)
    .to(Authenticator)
    .inSingletonScope();

  return container;
};

export default getContainer;
