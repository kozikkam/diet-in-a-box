import * as dotenv from "dotenv";
import { injectable } from "inversify";
import { IConfig } from "./IConfig";

@injectable()
export class Config implements IConfig {
  public PORT: number;
  public DB_URL: string;
  public JWT_SECRET: string;
  public API_PREFIX: string;
  public API_PATH: string;
  public PRODUCT_INTEGRATIONS_URL: string;

  private readonly requiredEnvs: string[];

  constructor() {
    this.requiredEnvs = [
      "PORT",
      "DB_URL",
      "JWT_SECRET"
    ];
    this.loadConfiguration();
  }

  public loadConfiguration(): void {
    dotenv.config();

    for (const key of this.requiredEnvs) {
      if (!process.env[key]) {
        throw new Error(`${key} is required, and is not specified in environment variables`);
      }
    }

    this.PORT = parseInt(process.env.PORT, 10);
    this.DB_URL = process.env.DB_URL;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.API_PREFIX = "api";
    this.API_PATH = `/${this.API_PREFIX}/`;
    this.PRODUCT_INTEGRATIONS_URL = process.env.PRODUCT_INTEGRATIONS_URL || "http://localhost:9001/api/products";
  }
}
