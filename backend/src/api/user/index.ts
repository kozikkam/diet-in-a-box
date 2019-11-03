import { Application } from "express";
import { Container } from "inversify";
import { IDatabase } from "../../core/database/IDatabase";
import { handleEndpointError } from "../../core/errorHandler/handleEndpointError";
import { TYPES } from "../../ioc/types";
import { IPostUserController } from "./controller/postUserController/IPostController";
import getContainer from "./ioc/inversify.config";
import { USER_TYPES } from "./ioc/UserTypes";

export const initUserRoutes = (app: Application, prefix: string = "" ): void => {
  const container: Container = getContainer();

  const database: IDatabase = container.get<IDatabase>(TYPES.IDatabase);
  database.getConnection();
  
  const postUserController: IPostUserController = container.get(USER_TYPES.IPostUserController);
  const getUserController: IPostUserController = container.get(USER_TYPES.IGetUserController);

  app.post(`${prefix}/user`, handleEndpointError(postUserController.process.bind(postUserController)));
  app.get(`${prefix}/user`, handleEndpointError(getUserController.process.bind(getUserController)));
};
