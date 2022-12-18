"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchErrors = void 0;
const typeorm_1 = require("typeorm");
/**
 * Basic helper functions to catch errors in an express route
 * @param error An error that was previously thrown
 * @param res The express response object to return some information about the error to the user
 */
const catchErrors = (error, res) => {
    if (error instanceof typeorm_1.EntityNotFoundError) {
        // Catches EntityNotFound errors as a common type of errors and returns a 404 to the user
        res.sendStatus(404);
    }
    else {
        // All other errors are currently treated as server errors
        // TODO: Improve error handling and provide more meaningful informations to the user
        console.error(error);
        res.sendStatus(500);
    }
};
exports.catchErrors = catchErrors;
