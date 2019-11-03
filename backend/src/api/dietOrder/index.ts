import { Application } from "express";
import { Container } from "inversify";
import { IDatabase } from "../../core/database/IDatabase";
import { handleEndpointError } from "../../core/errorHandler/handleEndpointError";
import { TYPES } from "../../ioc/types";
import { IGetDietOrderController } from "./controller/getDietOrderController/IGetController";
import { IPostDietOrderController } from "./controller/postDietOrderController/IPostController";
import { IPutDietOrderController } from "./controller/putDietOrderController/IPutController";
import { DIET_ORDER_TYPES } from "./ioc/DietOrderTypes";
import getContainer from "./ioc/inversify.config";

export const initDietOrderRoutes = (app: Application, prefix: string = "" ): void => {
  const container: Container = getContainer();

  const database: IDatabase = container.get<IDatabase>(TYPES.IDatabase);
  database.getConnection();

  const postDietOrderController: IPostDietOrderController = container.get(DIET_ORDER_TYPES.IPostDietOrderController);
  const getDietOrderController: IGetDietOrderController = container.get(DIET_ORDER_TYPES.IGetDietOrderController);
  const updateDietOrderController: IPutDietOrderController = container.get(DIET_ORDER_TYPES.IPutDietOrderController);

  const path = `${prefix}/dietOrder`;
  app.post(path, handleEndpointError(postDietOrderController.process.bind(postDietOrderController)));
  app.get(path, handleEndpointError(getDietOrderController.process.bind(getDietOrderController)));
  app.put(`${path}/:id`, handleEndpointError(updateDietOrderController.process.bind(updateDietOrderController)));
};
