"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRouter = void 0;
const checkForId_1 = require("../middleware/checkForId");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const catchErrors_1 = require("../middleware/catchErrors");
/**
 * Creates a BaseRouter that provides the basic CRUD operation routes for an item
 * @param controller The controller to read and write the items to the database
 * @param accessRights A config object configuring which roles get which CRUD access to the routes
 * @param overrideRoutes An array of routes to be overwritten (eg. to then redefine them in the child router)
 * @param authenticationFunction A middleware authentication function that decides whether a request to the route is allowed or not
 * @returns A BaseRouter that provides the basic CRUD operation routes for an item
 */
const baseRouter = (controller, accessRights, overrideRoutes = [], authenticationFunction) => {
    const router = express_1.default.Router();
    router.use(body_parser_1.default.json());
    if (!overrideRoutes.includes('/create')) {
        router.put('/create', authenticationFunction(accessRights.createAccess), (req, res) => {
            controller
                .create(req.body)
                .then((model) => res.status(200).send(model))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/createMultiple')) {
        router.put('/createMultiple', authenticationFunction(accessRights.createAccess), (req, res) => {
            controller
                .createMultiple(req.body)
                .then((models) => res.status(200).send(models))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/read')) {
        router.get('/read', authenticationFunction(accessRights.readAccess), (req, res) => {
            const id = Number(req.query.id);
            controller
                .read(id)
                .then((entity) => res.send(entity))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/readAll')) {
        router.get('/readAll', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readAll()
                .then((entities) => res.send(entities))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/readBy')) {
        router.get('/readBy', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readBy(JSON.parse(req.query.search))
                .then((entities) => res.send(entities))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/readOneBy')) {
        router.get('/readOneBy', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readOneBy(JSON.parse(req.query.search))
                .then((entity) => res.send(entity))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/update')) {
        router.post('/update', authenticationFunction(accessRights.updateAccess), checkForId_1.checkForId, (req, res) => {
            controller
                .update(req.body)
                .then((model) => res.status(200).send(model))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    if (!overrideRoutes.includes('/delete')) {
        router.delete('/delete', authenticationFunction(accessRights.deleteAccess), checkForId_1.checkForId, (req, res) => {
            controller
                .delete(req.body.id)
                .then((id) => res.status(200).send({ id }))
                .catch((e) => (0, catchErrors_1.catchErrors)(e, res));
        });
    }
    return router;
};
exports.baseRouter = baseRouter;
