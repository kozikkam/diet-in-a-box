import { NextFunction, Request, Response } from "express";
import { Container } from "inversify";
import {
  controller,
  httpGet,
  interfaces
} from "inversify-express-utils";
import { PRODUCT_TYPES } from "./ioc/ProductTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";
import { IProductService } from "./service/IProductService";
import { IProduct } from "./model/Product";
import { SuccessResponse } from "../../response/SuccessResponse";
import { BadRequestError } from "../../core/error/BadRequestError";

const config: Config = new Config();
const ENDPOINT: string = "products";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class ProductController implements interfaces.Controller {
  private readonly _container: Container = getContainer();
  private readonly _productService: IProductService =
    this._container.get<IProductService>(PRODUCT_TYPES.IProductService);

  @httpGet("/")
  public async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const productName: string = req.query.name;
      if (!productName) {
        throw new BadRequestError("Must provide 'name' parameter");
      }
      const products: IProduct[] = await this._productService.queryProducts(productName);
      return res.json(SuccessResponse.Ok(products));
    } catch (error) {
      next(error);
    }
  }
}
