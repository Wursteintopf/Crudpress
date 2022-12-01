import { checkForId } from '../middleware/checkForId';
import bodyParser from 'body-parser';
import express from 'express';
import { catchErrors } from '../middleware/catchErrors';
export const baseRouter = (controller, accessRights, overrideRoutes = [], authenticationFunction) => {
    const router = express.Router();
    router.use(bodyParser.json());
    if (!overrideRoutes.includes('/create')) {
        router.put('/create', authenticationFunction(accessRights.createAccess), (req, res) => {
            controller
                .create(req.body)
                .then((model) => res.status(200).send(model))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/createMultiple')) {
        router.put('/createMultiple', authenticationFunction(accessRights.createAccess), (req, res) => {
            controller
                .createMultiple(req.body)
                .then((models) => res.status(200).send(models))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/read')) {
        router.get('/read', authenticationFunction(accessRights.readAccess), (req, res) => {
            const id = Number(req.query.id);
            controller
                .read(id)
                .then((entity) => res.send(entity))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/readAll')) {
        router.get('/readAll', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readAll()
                .then((entities) => res.send(entities))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/readBy')) {
        router.get('/readBy', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readBy(JSON.parse(req.query.search))
                .then((entities) => res.send(entities))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/readOneBy')) {
        router.get('/readOneBy', authenticationFunction(accessRights.readAccess), (req, res) => {
            controller
                .readOneBy(JSON.parse(req.query.search))
                .then((entity) => res.send(entity))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/update')) {
        router.post('/update', authenticationFunction(accessRights.updateAccess), checkForId, (req, res) => {
            controller
                .update(req.body)
                .then((model) => res.status(200).send(model))
                .catch((e) => catchErrors(e, res));
        });
    }
    if (!overrideRoutes.includes('/delete')) {
        router.delete('/delete', authenticationFunction(accessRights.deleteAccess), checkForId, (req, res) => {
            controller
                .delete(req.body.id)
                .then((id) => res.status(200).send({ id }))
                .catch((e) => catchErrors(e, res));
        });
    }
    return router;
};
