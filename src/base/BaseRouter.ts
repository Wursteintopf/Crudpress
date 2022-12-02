import { checkForId } from '../middleware/checkForId'
import { Role } from '../data_types/Role'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { BaseModel } from './BaseModel'
import { catchErrors } from '../middleware/catchErrors'
import { BaseController } from './BaseController'

export interface AccessRights {
  createAccess: Role[]
  readAccess: Role[]
  updateAccess: Role[]
  deleteAccess: Role[]
}

/**
 * Creates a BaseRouter that provides the basic CRUD operation routes for an item
 * @param controller The controller to read and write the items to the database
 * @param accessRights A config object configuring which roles get which CRUD access to the routes
 * @param overrideRoutes An array of routes to be overwritten (eg. to then redefine them in the child router)
 * @param authenticationFunction A middleware authentication function that decides whether a request to the route is allowed or not
 * @returns A BaseRouter that provides the basic CRUD operation routes for an item
 */
export const baseRouter = <Model extends BaseModel>(
  controller: BaseController<Model>,
  accessRights: AccessRights,
  overrideRoutes: string[] = [],
  authenticationFunction: (accessRights: Role[], skip?: boolean) => (req: Request, res: Response, next: NextFunction) => void,
) => {
  const router = express.Router()

  router.use(bodyParser.json())

  if (!overrideRoutes.includes('/create')) {
    router.put(
      '/create',
      authenticationFunction(accessRights.createAccess),
      (req, res) => {
        controller
          .create(req.body)
          .then((model) => res.status(200).send(model))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/createMultiple')) {
    router.put(
      '/createMultiple',
      authenticationFunction(accessRights.createAccess),
      (req, res) => {
        controller
          .createMultiple(req.body)
          .then((models) => res.status(200).send(models))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/read')) {
    router.get(
      '/read',
      authenticationFunction(accessRights.readAccess),
      (req, res) => {
        const id = Number(req.query.id as string)
        controller
          .read(id)
          .then((entity) => res.send(entity))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/readAll')) {
    router.get(
      '/readAll',
      authenticationFunction(accessRights.readAccess),
      (req, res) => {
        controller
          .readAll()
          .then((entities) => res.send(entities))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/readBy')) {
    router.get(
      '/readBy',
      authenticationFunction(accessRights.readAccess),
      (req, res) => {
        controller
          .readBy(JSON.parse(req.query.search as string))
          .then((entities) => res.send(entities))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/readOneBy')) {
    router.get(
      '/readOneBy',
      authenticationFunction(accessRights.readAccess),
      (req, res) => {
        controller
          .readOneBy(JSON.parse(req.query.search as string))
          .then((entity) => res.send(entity))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/update')) {
    router.post(
      '/update',
      authenticationFunction(accessRights.updateAccess),
      checkForId,
      (req, res) => {
        controller
          .update(req.body)
          .then((model) => res.status(200).send(model))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  if (!overrideRoutes.includes('/delete')) {
    router.delete(
      '/delete',
      authenticationFunction(accessRights.deleteAccess),
      checkForId,
      (req, res) => {
        controller
          .delete(req.body.id)
          .then((id) => res.status(200).send({ id }))
          .catch((e) => catchErrors(e, res))
      },
    )
  }

  return router
}
