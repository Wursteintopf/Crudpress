import { DataSource, Repository } from "typeorm";
import { BaseModel } from "./BaseModel";
export declare class BaseController<Model extends BaseModel> {
    protected repository: Repository<Model>;
    protected ModelConstructor: new () => Model;
    constructor(ModelConstructor: new () => Model, appDataSource: DataSource);
    create(params: Partial<Model>): Promise<Model>;
    createMultiple(params: Partial<Model>[]): Promise<Model[]>;
    read(id: number): Promise<Model>;
    readAll(): Promise<Model[]>;
    readBy(params: Partial<Model>): Promise<Model[]>;
    readOneBy(params: Partial<Model>): Promise<Model>;
    update(params: Partial<Model> & {
        id: number;
    }): Promise<Model>;
    delete(id: number): Promise<number>;
}
