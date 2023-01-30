import { DataSource, EntityNotFoundError, Repository } from 'typeorm'
import { FindRequest } from '../types/FindRequest'
import { addTableFilter } from './BaseControllerUtils/addTableFilter'
import { BaseModel } from './BaseModel'

/**
 * BaseController that provides basic CRUD functions to read and write items from the database
 */
export class BaseController<Model extends BaseModel> {
  protected repository: Repository<Model>
  protected type: string
  protected ModelConstructor: new () => Model
  protected entities: Record<string, new () => BaseModel>
  protected appDataSource: DataSource

  /**
   * Initializes the BaseController that provides basic CRUD functions to read and write items from the database
   * @param ModelConstructor The constructor to create new models with
   * @param appDataSource The TypeORM data source to connect to
   */
  constructor (
    ModelConstructor: new () => Model,
    appDataSource: DataSource,
    type: Model['type'],
    entities: Record<string, new () => BaseModel>,
  ) {
    this.type = type
    this.entities = entities
    this.ModelConstructor = ModelConstructor
    this.repository = appDataSource.getRepository<Model>(ModelConstructor)
    this.appDataSource = appDataSource
  }

  public async get (id: number): Promise<Model> {
    const model = await this.repository.findOne({ where: { id: id as any } })
    if (!model) throw new EntityNotFoundError(this.ModelConstructor, '')
    return model
  }

  public async find (filter: FindRequest<Model>): Promise<Model[]> {
    const queryBuilder = this.repository.createQueryBuilder(this.type)

    // Add the basic table filter
    addTableFilter(filter, queryBuilder, this.type, this.entities, this.appDataSource)

    // Add a limit it applicable
    if (filter.limit) {
      queryBuilder.limit(filter.limit)
    }

    // Order if applicable
    if (filter.orderBy) {
      queryBuilder.orderBy(
        String(filter.orderBy.key),
        filter.orderBy.direction,
      )
    }

    return await queryBuilder.getMany()
  }

  public async create (params: Partial<Model>[]): Promise<Model[]> {
    const models = params.map((param) => {
      const model = new this.ModelConstructor()
      model.set(param)
      return model
    })
    return await this.repository.save(models)
  }

  public async delete (id: number): Promise<number> {
    await this.repository.delete({ id: id as any })
    return id
  }
}
