import { NextFunction, Request, Response } from 'express';
/**
 * Basic express middleware function that checks if a request included an id and returns a 400 to the user if not
 * @param req The Express Request object containing information about the Request
 * @param res The Express Response object that provides functions to send a response to the user
 * @param next Express Function to move to the next middleware function
 */
export declare const checkForId: (req: Request, res: Response, next: NextFunction) => void;
