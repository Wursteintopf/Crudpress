import { GeneralResponse } from './GeneralResponse'
import { ModelInterface } from './ModelInterface'

/**
 * The GetRequest type the API expects when receiving get requests
 */
export type GetRequest = { id: number }

/**
 * The FindResponse type the API will return for a find request
 */
export type GetResponse<Model extends ModelInterface> = GeneralResponse<Model>
