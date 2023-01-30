import { checkForId } from '../middleware/checkForId'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { BaseModel } from './BaseModel'
import { catchErrors } from '../middleware/catchErrors'
import { BaseController } from './BaseController'
import { DataSource } from 'typeorm'

/**
 * Creates a BaseRouter that provides the basic CRUD operation routes for an item
 * @param controller The controller to read and write the items to the database
 * @param accessRights A config object configuring which roles get which CRUD access to the routes
 * @param overrideRoutes An array of routes to be overwritten (eg. to then redefine them in the child router)
 * @param authenticationFunction A middleware authentication function that decides whether a request to the route is allowed or not
 * @returns A BaseRouter that provides the basic CRUD operation routes for an item
 */
export const baseRouter = (
  appDataSource: DataSource,
  type: string,
  entities: Record<string, new () => BaseModel>,
  authenticationFunction: () => (req: Request, res: Response, next: NextFunction) => void,
) => {
  const ModelConstructor = entities[type]

  if (!ModelConstructor) {
    throw new Error(`Type ${type} does not exist within the entities record.`)
  }

  const controller = new BaseController(ModelConstructor, appDataSource, type, entities)
  const router = express.Router()

  router.use(bodyParser.json())

  router.get(
    '/get',
    authenticationFunction(),
    checkForId,
    (req, res) => {
      const id = Number(req.query.id as string)
      controller
        .get(id)
        .then((entity) => res.send(entity))
        .catch((e) => catchErrors(e, res))
    },
  )

  router.post(
    '/find',
    authenticationFunction(),
    (req, res) => {
      controller
        .find(req.body)
        .then((models) => res.send(models))
        .catch((e) => catchErrors(e, res))
    },
  )

  router.post(
    '/create',
    authenticationFunction(),
    (req, res) => {
      controller
        .create(req.body)
        .then((models) => res.send(models))
        .catch((e) => catchErrors(e, res))
    },
  )

  router.delete(
    '/delete',
    authenticationFunction(),
    checkForId,
    (req, res) => {
      controller
        .delete(req.body.id)
        .then((id) => res.status(200).send({ id }))
        .catch((e) => catchErrors(e, res))
    },
  )

  return router
}
