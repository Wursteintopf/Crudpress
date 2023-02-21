import { BaseModel } from '../base'

export type ItemConfig<Model extends BaseModel> = {
  type: Model['type']
  constructor: new () => Model
  equalityKeys: ReadonlyArray<keyof Model>
}

export const makeItemConfig = <Model extends BaseModel>(config: ItemConfig<Model>) => {
  return config
}
