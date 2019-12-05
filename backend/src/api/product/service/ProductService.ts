import { inject, injectable } from "inversify";
import { PRODUCT_REPOSITORIES } from "../ioc/ProductTypes";
import { IProductRepository } from "../repository/IProductRepository";
import { IProduct } from "../model/Product";
import { BadRequestError } from "../../../core/error/BadRequestError";
import _ from "lodash";
import { IExternalProviderProduct } from "../model/IExternalProviderProduct";
import Axios from "axios";
import { TYPES } from "../../../ioc/types";
import { IConfig } from "../../../config/IConfig";

const requestPromise = require("request-promise");
const NR_OF_PRODUCTS_TO_SEED: number = 4000;

@injectable()
export class ProductService {
  @inject(PRODUCT_REPOSITORIES.IProductRepository)
  private readonly _productRepository: IProductRepository;
  @inject(TYPES.IConfig)
  private readonly _config: IConfig;

  public async getProducts(): Promise<IProduct[]> {
    return await this._productRepository.getMany();
  }

  public async postProduct(productParams: IProduct): Promise<IProduct> {
    return await this._productRepository.insertOne(productParams);
  }

  public async putProduct(
    id: string,
    productParams: IProduct
  ): Promise<IProduct> {
    const productToModify: IProduct = await this._productRepository.getOne({
      _id: id
    });
    if (productToModify) {
      const updated: IProduct = await this._productRepository.updateOneById(
        id,
        {
          $set: productParams
        }
      );
      return updated;
    }
    throw new BadRequestError();
  }

  public async seedProducts(
    appId: string,
    appKey: string
  ): Promise<IProduct[]> {
    let products: IProduct[] = [];
    const offset: number = 40;
    let nrOfProductsFetched: number = 0;
    while (nrOfProductsFetched < NR_OF_PRODUCTS_TO_SEED) {
      const requestParams: any = {
        uri: "https://api.edamam.com/api/food-database/parser",
        qs: {
          session: 0 + nrOfProductsFetched,
          ingr: "*",
          category: "generic-foods",
          categoryLabel: "food",
          app_id: appId,
          app_key: appKey
        },
        json: true
      };
      try {
        const productsPayload: any = await requestPromise(requestParams);
        products = products.concat(productsPayload.hints);
        nrOfProductsFetched += offset;

        // really ugly workaround for 30 requests per minute for free database subscription
        await this.sleep(2000);
      } catch (err) {
        throw new BadRequestError(
          "Cannot fetch products from external source. Please check if needed params are valid."
        );
      }
    }
    const productsToSave: IProduct[] = this.getProductsInDBSchape(
      _.uniq(products, "label")
    );
    return await this._productRepository.insertMany(productsToSave);
  }

  public async searchForProduct(productName: string): Promise<IExternalProviderProduct[]> {  
    // inject httpRequester in real world, handle exceptions
    const { data: { message } } = await Axios.get(
      this._config.PRODUCT_INTEGRATIONS_URL,
      { params: { name: productName }},
    );
    const responses: IExternalProviderProduct[] = message;
    
    for (const response of responses) {
      if (!this._productRepository.getOneByName(response.name)) {
        await this._productRepository.insertOne({
          name: response.name,
          photo: response.photo,
          kcal: response.kcal,
          protein: response.protein,
          carbohydrate: response.carbohydrate,
          fat: response.fat,
          fibre: response.fibre,
        } as any);
      }
    }

    return responses;
  }

  private getProductsInDBSchape(products: any): IProduct[] {
    return products.map((product: any) => {
      const nutrients: any = product.food.nutrients;
      return {
        name: this.capitalize(product.food.label),
        kcal: nutrients.ENERC_KCAL || 0,
        protein: nutrients.PROCNT || 0,
        carbohydrate: nutrients.CHOCDF || 0,
        fat: nutrients.FAT || 0,
        fibre: nutrients.FIBTG || 0,
        photo: ""
      };
    });
  }

  private readonly capitalize = (s: string) => {
    if (typeof s !== "string") {
      return "";
    }
    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  private sleep(sleepingTime: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, sleepingTime));
  }
}
