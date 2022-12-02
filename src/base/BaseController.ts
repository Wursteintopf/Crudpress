import { DataSource, EntityNotFoundError, Repository } from 'typeorm'
import { BaseModel } from './BaseModel'

/**
 * BaseController that provides basic CRUD functions to read and write items from the database
 */
export class BaseController<Model extends BaseModel> {
  protected repository: Repository<Model>
  protected ModelConstructor: new () => Model

  /**
   * Initializes the BaseController that provides basic CRUD fucntions to read and write items from the database
   * @param ModelConstructor The constructor to create new models with
   * @param appDataSource The TypeORM data source to connect to
   */
  constructor (ModelConstructor: new () => Model, appDataSource: DataSource) {
    this.ModelConstructor = ModelConstructor
    this.repository = appDataSource.getRepository<Model>(ModelConstructor)
  }

  public async create (params: Partial<Model>): Promise<Model> {
    const model = new this.ModelConstructor()
    model.set(params)
    return await this.repository.save(model)
  }

  public async createMultiple (params: Partial<Model>[]): Promise<Model[]> {
    const models = params.map((param) => {
      const model = new this.ModelConstructor()
      model.set(param)
      return model
    })
    return await this.repository.save(models)
  }

  public async read (id: number): Promise<Model> {
    const model = await this.repository.findOne({ where: { id: id as any } })
    if (!model) throw new EntityNotFoundError(this.ModelConstructor, '')
    return model
  }

  public async readAll (): Promise<Model[]> {
    return await this.repository.find()
  }

  public async readBy (params: Partial<Model>): Promise<Model[]> {
    return await this.repository.findBy(params as any)
  }

  public async readOneBy (params: Partial<Model>): Promise<Model> {
    const model = await this.repository.findOne({ where: params as any })
    if (!model) throw new EntityNotFoundError(this.ModelConstructor, '')
    return model
  }

  public async update (params: Partial<Model> & { id: number }): Promise<Model> {
    const model = await this.read(params.id)
    model.set(params)
    return await this.repository.save(model)
  }

  public async delete (id: number): Promise<number> {
    await this.repository.delete({ id: id as any })
    return id
  }
}
