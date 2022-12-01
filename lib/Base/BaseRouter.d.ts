import { Role } from "../data_types/Role";
import { NextFunction, Request, Response } from "express";
import { BaseModel } from "./BaseModel";
import { BaseController } from "./BaseController";
export interface AccessRights {
    createAccess: Role[];
    readAccess: Role[];
    updateAccess: Role[];
    deleteAccess: Role[];
}
export declare const baseRouter: <Model extends BaseModel>(controller: BaseController<Model>, accessRights: AccessRights, overrideRoutes: string[] | undefined, authenticationFunction: (accessRights: Role[], skip?: boolean) => (req: Request, res: Response, next: NextFunction) => void) => import("express-serve-static-core").Router;
