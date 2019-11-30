import "reflect-metadata";

import { Container } from "inversify";
import { Config } from "../config/Config";
import { IConfig } from "../config/IConfig";
import { ErrorHandler } from "../core/errorHandler/ErrorHandler";
import { IErrorHandler } from "../core/errorHandler/IErrorHandler";
import { ILogger } from "../core/logger/ILogger";
import { Logger } from "../core/logger/Logger";
import { IValidator } from "../core/validator/IValidator";
import { Validator } from "../core/validator/Validator";
import { TYPES } from "./types";

// import controllers here
import "./../api/product";

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
    .bind<IErrorHandler>(TYPES.IErrorHandler)
    .to(ErrorHandler)
    .inSingletonScope();

  return container;
};

export default getContainer;
