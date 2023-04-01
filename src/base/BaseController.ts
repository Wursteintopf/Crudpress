import { logDebug } from '@youlys/logger'
import { DataSource, EntityMetadata, EntityNotFoundError, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { DeleteRequest, DeleteResponse } from '../types/DeleteRequest'
import { FindRequest, FindResponse, TableFilter, TimeFilter } from '../types/FindRequest'
import { GetRequest, GetResponse } from '../types/GetRequest'
import { SaveRequest, SaveResponse } from '../types/SaveRequest'
import { addLinksToModels } from './BaseControllerUtils/addLinksToModels'
import { addSearchParams } from './BaseControllerUtils/addSearchParams'
import { addTimeFilter } from './BaseControllerUtils/addTimeFilter'
import { BaseModel } from './BaseModel'

/**
 * BaseController that provides basic CRUD functions to read and write items from the database
 */
export class BaseController<Model extends BaseModel> {
  protected repository: Repository<Model>
  protected type: string
  protected equalityKeys: ReadonlyArray<keyof Model>
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
    equalityKeys: ReadonlyArray<keyof Model>,
    entities: Record<string, new () => BaseModel>,
  ) {
    this.type = type
    this.equalityKeys = equalityKeys
    this.entities = entities
    this.ModelConstructor = ModelConstructor
    this.repository = appDataSource.getRepository<Model>(ModelConstructor)
    this.appDataSource = appDataSource
  }

  /**
   * Gets a specific model by its id
   * @param id The id of the model to get
   * @returns {Promise<GetResponse<Model>>} The model
   */
  public async get (req: GetRequest): Promise<GetResponse<Model>> {
    const model = await this.repository.findOne({ where: { id: req.id as any } })
    if (!model) throw new EntityNotFoundError(this.ModelConstructor, '')
    return {
      items: [model],
    }
  }

  private buildBaseQuery (req: FindRequest<Model>) {
    const { searchParams, timeFilter, limit, orderBy } = req
    let query = this.repository.createQueryBuilder(this.type)

    if (searchParams) query = addSearchParams(query, this.type, searchParams)
    if (timeFilter) query = addTimeFilter(query, this.type, timeFilter)

    if (orderBy) {
      const { key, direction } = orderBy
      query = query.orderBy(`${this.type}.${String(key)}`, direction)
    }

    if (limit) {
      query = query.limit(limit)
    }

    return query
  }

  /**
   * Search for multiple models based on a filter
   * @param req The filter to search for
   * @returns {Promise<FindResponse<Model>>} An array of models matching the filter
   */
  public async find (req: FindRequest<Model>): Promise<FindResponse<Model>> {
    const query = this.buildBaseQuery(req)
    const items = await query.getMany()
    await addLinksToModels(items, req.links, this.repository.metadata, this.appDataSource)
    return { items }
  }

  /**
   * Save a model to the database. If the specified equality keys match 
   * the existing one will be updated, else a new one created
   * @param modelPartial A partial of the model properties to be saved
   * @returns {Promise<Model>} The newly created model
   */
  public async saveSingle (modelPartial: Partial<Model>): Promise<Model> {    
    if (this.equalityKeys.length > 0) {
      // If we have equality keys, search if there is already an object where the equality keys match
      const where = this.equalityKeys.reduce<FindOptionsWhere<Model>>((prev, current) => {
        if (!modelPartial[current]) { return prev }
        return { ...prev, [current]: modelPartial[current] }
      }, {})

      // If a model is found, update and save it
      const searchedModel = await this.repository.findOne({ where })
      if (searchedModel) {
        logDebug(`Found model of type ${searchedModel.type} with id ${searchedModel.id}. Updating it.`)
        searchedModel.set(modelPartial)
        return await this.repository.save(searchedModel)
      }
    }

    // If no model is found, just save it as a new one
    const model = new this.ModelConstructor().set(modelPartial)
    logDebug(`No equal model of type ${model.type} found. Saving as a new one.`)
    return await this.repository.save(model)
  }

  /**
   * Save multiple models to the database. Existing ones will be updated,
   * new ones will be created
   * @param partialArray An array of partials containing the properties to be saved
   * @returns {Promise<SaveResponse<Model>>} An array of the newly created models
   */
  public async save (partialArray: SaveRequest<Model>): Promise<SaveResponse<Model>> {
    return {
      items: await Promise.all(partialArray.map(async param => await this.saveSingle(param))),
    }
  }

  /**
   * Delete a model by its id
   * @param id The id of the to be deleted model
   * @returns The id of the deleted model
   */
  public async delete (req: DeleteRequest): Promise<DeleteResponse> {
    await this.repository.delete({ id: req.id as any })
    return { items: [req.id] }
  }
}
