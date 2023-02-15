import { BaseModel } from '../base'
import { GeneralResponse } from './GeneralResponse'

type OrderDirection = 'ASC' | 'DESC';

export type TimeFilter = { before?: Date, after?: Date, limit?: number };

export type Link<Model extends BaseModel, Key extends keyof Model> = Model[Key] extends BaseModel
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

export type TableFilter<Model extends BaseModel> = {
  searchParams?: Partial<Model>
  links?: {
    [Key in keyof Model]?: Link<Model, Key>
  }
  timeFilter?: {
    [Key in keyof Model]?: Model[Key] extends Date ? TimeFilter : never;
  }
};

export type FindRequest<Model extends BaseModel> = TableFilter<Model> & {
  limit?: number
  orderBy?: {
    key: keyof Model
    direction: OrderDirection
  }
};

export type FindResponse<Model extends BaseModel> = GeneralResponse<Model[]>
