import { Role } from '../data_types/Role';
import { NextFunction, Request, Response } from 'express';
import { BaseModel } from './BaseModel';
import { BaseController } from './BaseController';
export interface AccessRights {
    createAccess: Role[];
    readAccess: Role[];
    updateAccess: Role[];
    deleteAccess: Role[];
}
/**
 * Creates a BaseRouter that provides the basic CRUD operation routes for an item
 * @param controller The controller to read and write the items to the database
 * @param accessRights A config object configuring which roles get which CRUD access to the routes
 * @param overrideRoutes An array of routes to be overwritten (eg. to then redefine them in the child router)
 * @param authenticationFunction A middleware authentication function that decides whether a request to the route is allowed or not
 * @returns A BaseRouter that provides the basic CRUD operation routes for an item
 */
export declare const baseRouter: <Model extends BaseModel>(controller: BaseController<Model>, accessRights: AccessRights, overrideRoutes: string[] | undefined, authenticationFunction: (accessRights: Role[], skip?: boolean) => (req: Request, res: Response, next: NextFunction) => void) => import("express-serve-static-core").Router;
