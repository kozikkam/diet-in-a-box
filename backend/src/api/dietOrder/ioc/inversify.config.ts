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
import { GetDietOrderController } from "../controller/getDietOrderController/GetController";
import { IGetDietOrderController } from "../controller/getDietOrderController/IGetController";
import { IPostDietOrderController } from "../controller/postDietOrderController/IPostController";
import { PostDietOrderController } from "../controller/postDietOrderController/PostController";
import { IPutDietOrderController } from "../controller/putDietOrderController/IPutController";
import { PutDietOrderController } from "../controller/putDietOrderController/PutController";
import { DietOrderRepository } from "../repository/DietOrderRepository";
import { IDietOrderRepository } from "../repository/IDietOrderRepository";
import { DIET_ORDER_REPOSITORIES, DIET_ORDER_TYPES } from "./DietOrderTypes";
import { DietOrderService } from "../service/DietOrderService";

const getContainer: (() => Container) = (): Container => {
  const container: Container = new Container();
  container.bind<IConfig>(TYPES.IConfig)
    .to(Config)
    .inSingletonScope();

  container.bind<IValidator>(TYPES.IValidator)
    .to(Validator)
    .inSingletonScope();

  container.bind<ILogger>(TYPES.ILogger)
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

  container.bind<IDietOrderRepository>(DIET_ORDER_REPOSITORIES.IDietOrderRepository)
    .to(DietOrderRepository);

  container.bind<IPostDietOrderController>(DIET_ORDER_TYPES.IPostDietOrderController)
    .to(PostDietOrderController)
    .inSingletonScope();

  container.bind<IGetDietOrderController>(DIET_ORDER_TYPES.IGetDietOrderController)
    .to(GetDietOrderController)
    .inSingletonScope();

  container.bind<IPutDietOrderController>(DIET_ORDER_TYPES.IPutDietOrderController)
    .to(PutDietOrderController)
    .inSingletonScope();

  container
    .bind<IAuthenticator>(TYPES.IAuthenticator)
    .to(Authenticator)
    .inSingletonScope();

  container.bind<DietOrderService>(DIET_ORDER_TYPES.IDietOrderService)
    .to(DietOrderService)
    .inSingletonScope();

  return container;
};

export default getContainer;
