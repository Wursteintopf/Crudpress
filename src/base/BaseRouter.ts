import { SaveResponse } from './../types/SaveRequest'
import { FindResponse } from './../types/FindRequest'
import { checkForId } from '../middleware/checkForId'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { BaseModel } from './BaseModel'
import { catchErrors } from '../middleware/catchErrors'
import { BaseController } from './BaseController'
import { DataSource } from 'typeorm'
import { GetResponse } from '../types/GetRequest'
import { DeleteResponse } from '../types/DeleteRequest'
import { ItemConfig } from '../types/ItemConfig'

/**
 * Creates a BaseRouter that provides the basic CRUD operation routes for an item
 * @param controller The controller to read and write the items to the database
 * @param accessRights A config object configuring which roles get which CRUD access to the routes
 * @param overrideRoutes An array of routes to be overwritten (eg. to then redefine them in the child router)
 * @param authenticationFunction A middleware authentication function that decides whether a request to the route is allowed or not
 * @returns A BaseRouter that provides the basic CRUD operation routes for an item
 */
export const baseRouter = <Model extends BaseModel>(params: {
  config: ItemConfig<Model>
  appDataSource: DataSource
  entities: Record<string, new () => BaseModel>
  authenticate: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
}) => {
  const { config, appDataSource, entities, authenticate } = params
  const { type, equalityKeys, constructor } = config
  const ModelConstructor = entities[type]

  if (!ModelConstructor) {
    throw new Error(`Type ${type} does not exist within the entities record.`)
  }

  const controller = new BaseController(
    constructor,
    appDataSource,
    type,
    equalityKeys,
    entities,
  )
  const router = express.Router()

  router.use(bodyParser.json())

  router.get('/get', authenticate(), checkForId, (req, res) => {
    const id = Number(req.query.id as string)
    controller
      .get({ id })
      .then((getResponse: GetResponse<BaseModel>) => res.send(getResponse))
      .catch((e) => catchErrors(e, res))
  })

  router.post('/find', authenticate(), (req, res) => {
    controller
      .find(req.body)
      .then((findResponse: FindResponse<BaseModel>) => res.send(findResponse))
      .catch((e) => catchErrors(e, res))
  })

  router.post('/save', authenticate(), (req, res) => {
    controller
      .save(req.body)
      .then((saveResponse: SaveResponse<BaseModel>) => res.send(saveResponse))
      .catch((e) => catchErrors(e, res))
  })

  router.delete('/delete', authenticate(), checkForId, (req, res) => {
    const id = Number(req.body.id)
    controller
      .delete({ id })
      .then((deleteResponse: DeleteResponse) => res.send(deleteResponse))
      .catch((e) => catchErrors(e, res))
  })

  return router
}
