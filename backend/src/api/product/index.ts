import { NextFunction, Request, Response } from "express";
import { Container, inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces
} from "inversify-express-utils";
import { IDatabase } from "../../core/database/IDatabase";
import { TYPES } from "../../ioc/types";
import { PRODUCT_TYPES } from "./ioc/ProductTypes";
import getContainer from "./ioc/inversify.config";
import { Config } from "../../config/Config";
import { IProductService } from "./service/IProductService";
import { IProduct } from "./model/Product";
import { SuccessResponse } from "../../response/SuccessResponse";
import { productPostSchema } from "./schema/post/postProduct";
import { productPutSchema } from "./schema/put/putProduct";
import { IAuthenticator } from "../../core/auth/IAuthenticator";
import { IValidator } from "../../core/validator/IValidator";

const config: Config = new Config();
const ENDPOINT: string = "products";

@controller(`${config.API_PATH}${ENDPOINT}`)
export class ProductController implements interfaces.Controller {
  private readonly _container: Container = getContainer();
  private readonly _productService: IProductService = this._container.get<
    IProductService
  >(PRODUCT_TYPES.IProductService);

  @inject(TYPES.IAuthenticator)
  private readonly _authenticator: IAuthenticator;

  @inject(TYPES.IValidator)
  private readonly _validator: IValidator;

  @httpGet("/")
  public async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const products: IProduct[] = await this._productService.getProducts();
      return res.json(SuccessResponse.Ok(products));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }

  @httpPost("/seed")
  public async seedProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    this._authenticator.authenticate(req.headers.authorization);
    req.setTimeout(300000);
    await this._productService.seedProducts(req.query.appId, req.query.appKey);
    return res.json(SuccessResponse.Created("Seeding completed"));
  }

  @httpPost("/")
  public async postProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    this._authenticator.authenticate(req.headers.authorization);
    this._validator.validate(req.body, productPostSchema);
    const product: IProduct = await this._productService.postProduct(req.body);
    return res.json(SuccessResponse.Created(product));
  }

  @httpPut("/")
  public async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      this._authenticator.authenticate(req.headers.authorization);
      this._validator.validate(req.body, productPutSchema);
      const updatedProduct: IProduct = await this._productService.putProduct(
        req.query.id,
        req.body
      );
      return res.json(SuccessResponse.Ok(updatedProduct));
    } catch (error) {
      return new Promise(() => {
        next(error);
      });
    }
  }
}
