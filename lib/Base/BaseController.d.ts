import { DataSource, Repository } from 'typeorm';
import { BaseModel } from './BaseModel';
/**
 * BaseController that provides basic CRUD functions to read and write items from the database
 */
export declare class BaseController<Model extends BaseModel> {
    protected repository: Repository<Model>;
    protected ModelConstructor: new () => Model;
    /**
     * Initializes the BaseController that provides basic CRUD fucntions to read and write items from the database
     * @param ModelConstructor The constructor to create new models with
     * @param appDataSource The TypeORM data source to connect to
     */
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
