import { Response } from 'express';
/**
 * Basic helper functions to catch errors in an express route
 * @param error An error that was previously thrown
 * @param res The express response object to return some information about the error to the user
 */
export declare const catchErrors: (error: Error, res: Response) => void;
