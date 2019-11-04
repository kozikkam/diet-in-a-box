import * as bodyParser from "body-parser";
import express, { Application } from "express";
import "reflect-metadata";
const helmet = require("helmet");
const cors = require("cors");

import { Container } from "inversify";
import { initDietRoutes } from "./api/diet";
import { initDietOrderRoutes } from "./api/dietOrder";
import { initUserRoutes } from "./api/user";
import { IConfig } from "./config/IConfig";
import { IDatabase } from "./core/database/IDatabase";
import { IErrorHandler } from "./core/errorHandler/IErrorHandler";
import getContainer from "./ioc/inversify.config";
import { TYPES } from "./ioc/types";

async function bootstrap(): Promise<void> {
  const container: Container = getContainer();
  const config: IConfig = container.get<IConfig>(TYPES.ILogger);
  const errorHandler: IErrorHandler = container.get<IErrorHandler>(
    TYPES.IErrorHandler
  );
  const database: IDatabase = container.get<IDatabase>(TYPES.IDatabase);
  database.getConnection();

  const app: Application = express();
  const port: number = config.PORT || 3000;

  initMiddlewares(app);

  const apiPrefix: string = "/api";
  initUserRoutes(app, apiPrefix);
  initDietOrderRoutes(app, apiPrefix);
  initDietRoutes(app, apiPrefix);

  app.use(errorHandler.handle());
  process
    .on("unhandledRejection", (reason: any, p: any) => {
      console.error(reason, "Unhandled rejection at Promise", p);
    })
    .on("uncaughtException", (error: any) => {
      console.error(error, "Uncaught Exception thrown");
      process.exit(1);
    });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

function initMiddlewares(app: Application): void {
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
}

bootstrap();
