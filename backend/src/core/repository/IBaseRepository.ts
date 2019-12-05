export interface IBaseRepository<T> {
  insertOne(data: T): Promise<T>;
  insertMany(data: T[]): Promise<T[]>;
  getMany(limit?: number, page?: number): Promise<T[]>;
  getManyByIds(ids: string[]): Promise<T[]>;
  getOne(params: object): Promise<T>;
  updateOneById(_id: string, params: object): Promise<T>;
  getCountByIds(ids: string[]): Promise<number>;
  getOneById(id: string): Promise<T>;
  getOneByName(name: string): Promise<T>;
}
