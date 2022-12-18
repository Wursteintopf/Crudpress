"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForId = void 0;
/**
 * Basic express middleware function that checks if a request included an id and returns a 400 to the user if not
 * @param req The Express Request object containing information about the Request
 * @param res The Express Response object that provides functions to send a response to the user
 * @param next Express Function to move to the next middleware function
 */
const checkForId = (req, res, next) => {
    const id = parseInt(req.body.id);
    if (!id) {
        res.status(400).send('No id provided.');
        return;
    }
    next();
};
exports.checkForId = checkForId;
