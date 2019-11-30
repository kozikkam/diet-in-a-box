import { injectable, inject } from "inversify";
import { IProduct } from "../model/Product";
import { BadRequestError } from "../../../core/error/BadRequestError";
import _ from "lodash";
import axios from "axios";
import { TYPES } from "../../../ioc/types";
import { IConfig } from "../../../config/IConfig";
import { ILogger } from "../../../core/logger/ILogger";
import { inspect } from "util";
import { INutritionixProduct } from "../model/INutritionixProduct";
import { IEdamamHint } from "../model/IEdamam";

@injectable()
export class ProductService {
  @inject(TYPES.IConfig)
  private readonly _config: IConfig;
  @inject(TYPES.ILogger)
  private readonly _logger: ILogger;

  public async queryProducts(
    name: string,
  ): Promise<IProduct[]> {
    try {
      // obviously search and mapping functions should be done as separate services
      // here it's all done in place for the sake of sparing time effort
      let products: any = await Promise.all([this.queryProductsEdamam(name), this.queryProductsNutritionix(name)]);
      products = _.flatten(products);
      products = _.uniqBy(products, (product) => product.name);
      return products;
    } catch (err) {
      throw new BadRequestError(
        "Cannot fetch products from external sources. Please check if needed params are valid."
      );
    }
  }

  private async queryProductsEdamam(name: string): Promise<IProduct[]> {
    try {
      const { data } = await axios.get(
        "https://api.edamam.com/api/food-database/parser",
        {
          params: {
            ingr: name,
            category: "generic-foods",
            categoryLabel: "food",
            app_id: this._config.EDAMAM_ID,
            app_key: this._config.EDAMAM_KEY,
          },
        },
      );
      const productsPayload: IEdamamHint[] = data.hints;
      const productsToSave: IProduct[] = this.mapEdamamProducts(
        _.uniq(productsPayload, "label")
      );
      return productsToSave;
    } catch (err) {
      this._logger.error(`Failed to load responses for Edamam, error: ${inspect(err)}`);
      return [];
    }
  }

  private mapEdamamProducts(products: IEdamamHint[]): IProduct[] {
    return products.map((product: any) => {
      const nutrients: any = product.food.nutrients;
      return {
        name: product.food.label.toLowerCase(),
        kcal: nutrients.ENERC_KCAL || 0,
        protein: nutrients.PROCNT || 0,
        carbohydrate: nutrients.CHOCDF || 0,
        fat: nutrients.FAT || 0,
        fibre: nutrients.FIBTG || 0,
        photo: "",
      };
    });
  }

  private async queryProductsNutritionix(name: string): Promise<IProduct[]> {
    try {
      const { data } = await axios.get(
        "https://trackapi.nutritionix.com/v2/search/instant",
        {
          headers: {
            "x-app-id": this._config.NUTRITIONIX_ID,
            "x-app-key": this._config.NUTRITIONIX_KEY,
          },
          params: {
            query: name,
          },
        },
      );
      const productsPayload: INutritionixProduct[] = data.common;
      const productsToSave: IProduct[] = this.mapNutritionixProducts(productsPayload);
      return productsToSave;
    } catch (err) {
      this._logger.error(`Failed to load responses for Nutritionix, error: ${inspect(err)}`);
      return [];
    }
  }

  private mapNutritionixProducts(products: INutritionixProduct[]): IProduct[] {
    return products.map((product: INutritionixProduct) => {
      return {
        name: product.food_name,
        kcal: 0,
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        fibre: 0,
        photo: product.photo.thumb,
      };
    });
  }
}
