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
import { GetUserController } from "../controller/getUserController/GetController";
import { IGetUserController } from "../controller/getUserController/IGetController";
import { IPostUserController } from "../controller/postUserController/IPostController";
import { PostUserController } from "../controller/postUserController/PostController";
import { IUserRepository } from "../repository/IUserRepository";
import { UserRepository } from "../repository/UserRepository";
import { USER_REPOSITORIES, USER_TYPES } from "./UserTypes";
import { UserService } from "../service/UserService";

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

  container.bind<IUserRepository>(USER_REPOSITORIES.IUserRepository)
    .to(UserRepository);

  container.bind<IPostUserController>(USER_TYPES.IPostUserController)
    .to(PostUserController)
    .inSingletonScope();

  container.bind<IGetUserController>(USER_TYPES.IGetUserController)
    .to(GetUserController)
    .inSingletonScope();

  container
    .bind<IAuthenticator>(TYPES.IAuthenticator)
    .to(Authenticator)
    .inSingletonScope();

  container.bind<UserService>(USER_TYPES.IUserService)
    .to(UserService)
    .inSingletonScope();

  return container;
};

export default getContainer;
