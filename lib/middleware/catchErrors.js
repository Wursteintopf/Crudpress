import { EntityNotFoundError } from 'typeorm';
/**
 * Basic helper functions to catch errors in an express route
 * @param error An error that was previously thrown
 * @param res The express response object to return some information about the error to the user
 */
export const catchErrors = (error, res) => {
    if (error instanceof EntityNotFoundError) {
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
