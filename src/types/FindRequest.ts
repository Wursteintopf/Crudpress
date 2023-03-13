import { GeneralResponse } from './GeneralResponse'
import { ModelInterface } from './ModelInterface'

export type OrderDirection = 'ASC' | 'DESC';
export type MapAmount = 'mapOne' | 'mapMany';

export type TimeFilter = { before?: Date, after?: Date, limit?: number };

type LinkBase<LinkedModel extends ModelInterface, Amount extends MapAmount> = {
  map: Amount
} & TableFilter<LinkedModel>

export type Link<Base extends ModelInterface, Key extends keyof Base> = 
  Base[Key] extends (ModelInterface | undefined) ? LinkBase<NonNullable<Base[Key]>, 'mapOne'> :
  Base[Key] extends (ModelInterface[] | undefined) ? LinkBase<NonNullable<Base[Key]>[number], 'mapMany'> :
  never

export type TableFilter<Model extends ModelInterface> = {
  searchParams?: Partial<Model>
  links?: {
    [Key in keyof Model]?: Link<Model, Key>
  }
  timeFilter?: {
    [Key in keyof Model]?: Model[Key] extends Date ? TimeFilter : never;
  }
};

/**
 * The FindRequest type the API expects when receiving find requests
 */
export type FindRequest<Model extends ModelInterface> = TableFilter<Model> & {
  limit?: number
  orderBy?: {
    key: keyof Model
    direction: OrderDirection
  }
};

/**
 * The FindResponse type the API will return for a find request
 */
export type FindResponse<Model extends ModelInterface> = GeneralResponse<Model[]>
