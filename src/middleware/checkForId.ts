import { NextFunction, Request, Response } from 'express'
import { isNullOrUndefined } from '@wursteintopf/typescript_utils'

/**
 * Basic express middleware function that checks if a request included an id and returns a 400 to the user if not
 * @param req The Express Request object containing information about the Request
 * @param res The Express Response object that provides functions to send a response to the user
 * @param next Express Function to move to the next middleware function
 */
export const checkForId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.query.id as string)

  if (isNullOrUndefined(id)) {
    res.status(400).send('No id provided.')
    return
  }

  next()
}
