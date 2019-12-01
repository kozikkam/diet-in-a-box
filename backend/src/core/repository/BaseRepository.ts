import { inject, injectable } from "inversify";
import { Connection, Document, Model, Schema } from "mongoose";
import { TYPES } from "../../ioc/types";
import { IDatabase } from "../database/IDatabase";
import { IBaseRepository } from "./IBaseRepository";

@injectable()
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T> {
  protected model: string;
  protected schema: Schema<T>;

  @inject(TYPES.IDatabase)
  private readonly _db: () => IDatabase;

  public async insertOne(data: T): Promise<T> {
    const model: Model<T> = await this.getModel();
    return model.create(data);
  }

  public async insertMany(data: T[]): Promise<T[]> {
    const model: Model<T> = await this.getModel();
    return model.insertMany(data);
  }

  public async getMany(limit?: number, page?: number): Promise<T[]> {
    const model: Model<T> = await this.getModel();
    if (!limit || !page) {
      return model.find({});
    }
    return model
      .find({})
      .limit(limit)
      .skip(page * limit);
  }

  public async getManyByIds(ids: string[]): Promise<T[]> {
    const model: Model<T> = await this.getModel();
    return model.find({
      _id: {
        $in: ids
      }
    });
  }

  public async getCountByIds(ids: string[]): Promise<number> {
    const model: Model<T> = await this.getModel();
    return model.countDocuments({
      _id: {
        $in: ids
      }
    });
  }

  public async getOne(params: object): Promise<T> {
    const model: Model<T> = await this.getModel();
    return model.findOne(params);
  }

  public async getOneById(id: string): Promise<T> {
    const model: Model<T> = await this.getModel();
    return model.findOne({ _id: id });
  }

  public async updateOneById(id: string, params: object): Promise<T> {
    const model: Model<T> = await this.getModel();
    return model.updateOne({ _id: id }, params);
  }

  protected async getModel(): Promise<Model<T>> {
    const dbInstance: IDatabase = await this._db();
    const connection: Connection = await dbInstance.getConnection();
    return connection.model<T>(this.model, this.schema);
  }
}
