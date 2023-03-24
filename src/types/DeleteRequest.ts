import { Response } from './Response'

/**
 * The DeleteRequest type the API expects when receiving delete requests
 */
export type DeleteRequest = { id: number }

/**
 * The DeleteRequest type the API will return for a delete request
 */
export type DeleteResponse = Response<number>
