import "reflect-metadata";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Application } from "express";
import helmet from "helmet";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { IConfig } from "./config/IConfig";
import { IErrorHandler } from "./core/errorHandler/IErrorHandler";
import getContainer from "./ioc/inversify.config";
import { TYPES } from "./ioc/types";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";

async function bootstrap(): Promise<void> {
  const container: Container = getContainer();
  const config: IConfig = container.get<IConfig>(TYPES.IConfig);
  const errorHandler: IErrorHandler = container.get<IErrorHandler>(
    TYPES.IErrorHandler
  );

  const server: InversifyExpressServer = new InversifyExpressServer(container);
  const port: number = config.PORT || 3001;

  server.setConfig((app: Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler.handle());
  });

  process
    .on("unhandledRejection", (reason: any, p: any) => {
      console.error(reason, "Unhandled rejection at Promise", p);
    })
    .on("uncaughtException", (error: any) => {
      console.error(error, "Uncaught Exception thrown");
      process.exit(1);
    });

  const application: Application = server.build();
  application.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

bootstrap();
