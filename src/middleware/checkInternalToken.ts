import { NextFunction, Request, Response } from 'express'
import { getInternalApiToken } from '../util/getInternalApiToken'

export const checkInternalToken = (req: Request, res: Response, next: NextFunction) => {
  const receivedToken = req.get('internalToken')
  const token = getInternalApiToken()

  if (receivedToken !== token) {
    res.sendStatus(403)
    return
  }

  next()
}
