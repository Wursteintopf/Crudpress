import { NextFunction, Request, Response } from 'express'

export const checkForId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.body.id)

  if (!id) {
    res.status(400).send('No id provided.')
    return
  }

  next()
}
