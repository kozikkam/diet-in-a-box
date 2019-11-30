import { IProduct } from "../model/Product";

export interface IProductService {
  queryProducts(name: string): Promise<IProduct[]>;
}
