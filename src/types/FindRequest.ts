import { BaseModel } from '../base'
import { GeneralResponse } from './GeneralResponse'
import { ModelInterface } from './ModelInterface'

export type OrderDirection = 'ASC' | 'DESC';

export type TimeFilter = { before?: Date, after?: Date, limit?: number };

export type Link<Model extends ModelInterface, Key extends keyof Model> = Model[Key] extends BaseModel
  ? {
      map: 'mapOne'
      type: Model[Key]['type']
    } & TableFilter<Model[Key]>
  : Model[Key] extends Array<BaseModel>
  ? {
      map: 'mapMany'
      type: Model[Key][number]['type']
    } & TableFilter<Model[Key][number]>
  : never;

export type TableFilter<Model extends ModelInterface> = {
  searchParams: Partial<Model>
  links: {
    [Key in keyof Model]?: Link<Model, Key>
  }
  timeFilter: {
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
