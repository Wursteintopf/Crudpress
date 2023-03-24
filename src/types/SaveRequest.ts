import { Response } from './Response'
import { ModelInterface } from './ModelInterface'

/**
 * The SaveRequest type the API expects when receiving save requests
 */
export type SaveRequest<Model extends ModelInterface> = Array<Partial<Model>>

/**
 * The SaveRequest type the API will return for a save request
 */
export type SaveResponse<Model extends ModelInterface> = Response<Model>
