import * as dotenv from "dotenv";
import { injectable } from "inversify";
import { IConfig } from "./IConfig";

@injectable()
export class Config implements IConfig {
  public PORT: number;
  public API_PATH: string;
  public EDAMAM_ID: string;
  public EDAMAM_KEY: string;
  public NUTRITIONIX_ID: string;
  public NUTRITIONIX_KEY: string;

  private readonly requiredEnvs: string[];

  constructor() {
    this.requiredEnvs = [
      "PORT",
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
    this.API_PATH = `/api/`;
    this.EDAMAM_ID = process.env.EDAMAM_ID;
    this.EDAMAM_KEY = process.env.EDAMAM_KEY;
    this.NUTRITIONIX_ID = process.env.NUTRITIONIX_ID;
    this.NUTRITIONIX_KEY = process.env.NUTRITIONIX_KEY;
  }
}
